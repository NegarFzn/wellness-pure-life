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
        const { slug, type, quizSlug, user, recent } = query;

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
        } = req.body;

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

        const token = await getToken({ req });
        const email = token?.email || emailFromBody;

        if (!quizSlug || !result || !answers || !email) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const saved = await saveQuizResult({
          slug: quizSlug,
          result,
          answers,
          email,
        });

        const recs = await getRecommendationsByTypeAndSlug(result, quizSlug);
        const quiz = await getQuizBySlug(quizSlug);

        if (!quiz) {
          return res.status(404).json({ error: "Quiz not found for email." });
        }

        const { subject, body } = createQuizResultEmail(
          email,
          result,
          answers,
          quiz,
          recs
        );

        await sendEmail(email, subject, body);

        return res.status(201).json({
          message: saved.newEntry
            ? "Result saved and email sent."
            : "Duplicate result; email sent for testing.",
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
