import { sendEmail } from "../../utils/email";
import { createQuizResultEmail } from "../../emails/emailCreator";
import { getToken } from "next-auth/jwt";

import {
  getAllQuizzes,
  getQuizBySlug,
  saveQuizResult,
  getRecommendationsByType,
  logRecommendationClick,
  getUserQuizHistory,
  getRecentQuizResults,
  getRecommendationsByTypeAndSlug,
} from "../../lib/quizzesdb";

export default async function handler(req, res) {
  const { method, query } = req;

  try {
    switch (method) {
      case "GET": {
        const { slug, type, quizSlug, user, recent, daily } = query;

        if (slug) {
          const quiz = await getQuizBySlug(slug);
          return quiz
            ? res.status(200).json(quiz)
            : res.status(404).json({ error: "Quiz not found" });
        }

        if (type && (quizSlug || slug)) {
          const recs = await getRecommendationsByTypeAndSlug(
            type,
            quizSlug || slug
          );
          return res.status(200).json(recs);
        }

        if (user === "true") {
          const history = await getUserQuizHistory(req);
          return res.status(200).json(history);
        }

        if (daily === "true") {
          const dailyHistory = await getUserQuizHistory(req, {
            filterDaily: true,
          });
          return res.status(200).json(dailyHistory);
        }

        if (recent === "true") {
          const results = await getRecentQuizResults();
          return res.status(200).json(results);
        }

        const quizzes = await getAllQuizzes();
        return res.status(200).json(quizzes);
      }

      case "POST": {
        const {
          quizSlug,
          result,
          answers,
          email: emailFromBody,
          recommendation,
          link,
          clickedAt,
          action,
          slug, // allow alt field
          isDaily, // optional flag from client
        } = req.body || {};

        // Track recommendation clicks
        if (action === "click") {
          await logRecommendationClick({
            quizSlug,
            result,
            recommendation,
            email: emailFromBody,
            link,
            clickedAt,
          });
          return res.status(201).json({ message: "Click recorded" });
        }

        // Use token email if available, otherwise fall back to body.email
        const token = await getToken({ req });
        const email = token?.email || emailFromBody;

        if (!quizSlug && !slug) {
          console.warn("POST /api/quizzes missing quizSlug or slug", {
            quizSlug,
            slug,
          });
          return res.status(400).json({ error: "Missing quiz slug" });
        }
        if (!result || !answers || !email) {
          console.warn("POST /api/quizzes missing required fields", {
            hasResult: !!result,
            hasAnswers: Array.isArray(answers) && answers.length > 0,
            emailFromToken: token?.email,
            emailFromBody,
          });
          return res.status(400).json({ error: "Missing required fields" });
        }

        // Normalize slug + daily flag
        const finalSlug =
          (quizSlug || slug || "").toString().toLowerCase() || "daily-quiz";
        const dailyFlag =
          typeof isDaily === "boolean"
            ? isDaily
            : finalSlug === "daily-quiz" || finalSlug === "daily-checkin";

        // Save first so daily-only users still get persisted even if no quiz config/email template
        const saved = await saveQuizResult({
          slug: finalSlug,
          quizSlug: finalSlug,
          result,
          answers,
          email,
          isDaily: dailyFlag,
        });

        // Try to load quiz config (may not exist for daily-quiz)
        const quiz = await getQuizBySlug(finalSlug);

        // If it's a daily check-in and there's no quiz config, just return success (skip email)
        if (!quiz && dailyFlag) {
          return res.status(201).json({
            message: saved?.newEntry
              ? "Daily result saved."
              : "Duplicate daily result ignored.",
            debug: { saved }, // optional: helps debug in frontend
          });
        }

        // If not daily and still no config, that's an error
        if (!quiz) {
          return res.status(404).json({ error: "Quiz not found for email." });
        }

        // Build recommendations and send email
        const recs = await getRecommendationsByTypeAndSlug(result, finalSlug);

        const { subject, body } = createQuizResultEmail(
          email,
          result,
          answers,
          quiz,
          recs
        );

        try {
          await sendEmail(email, subject, body);
        } catch (e) {
          // Don't fail the whole request if email fails; the result is already saved
          console.error("Email send failed:", e);
        }

        return res.status(201).json({
          message: saved?.newEntry
            ? "Result saved and email sent."
            : "Duplicate result; email attempted.",
        });
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
