import { MongoClient } from "mongodb";
import { generateMainQuizEmail } from "../../../emails/contentGenerator";
import { sendEmail } from "../../../utils/email";

const uri = process.env.MONGODB_URI;
const dbName = "wellnesspurelife";
const recommendationsCollection = "quiz_main_recommendations";
const questionsCollection = "quiz_main_questions";
const savedCollection = "quiz_main_saved";

export default async function handler(req, res) {
  let client;

  try {
    client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const method = req.method.toUpperCase();

    // ────────────────────────────────────────────────
    // GET → Questions
    // ────────────────────────────────────────────────
    if (method === "GET" && req.query.mode === "questions") {
      const quizzes = await db
        .collection(questionsCollection)
        .find({}, { projection: { _id: 0 } })
        .toArray();

      return res.status(200).json(quizzes);
    }

    // ────────────────────────────────────────────────
    // GET → Saved history by email
    // ────────────────────────────────────────────────
    if (method === "GET" && req.query.mode === "saved") {
      const email = req.query.email?.trim();
      if (!email) {
        return res.status(400).json({ error: "Missing or invalid email." });
      }

      const history = await db
        .collection(savedCollection)
        .find({ email }, { projection: { _id: 0 } })
        .sort({ savedAt: -1 })
        .toArray();

      return res.status(200).json({ history });
    }

    // ────────────────────────────────────────────────
    // GET → Match recommendations by answers
    // ────────────────────────────────────────────────
    if (method === "GET" && !req.query.mode) {
      const { slug, ...queryParams } = req.query;

      if (!slug) {
        return res.status(400).json({ error: "Missing 'slug' parameter." });
      }

      const query = { slug: slug.trim().toLowerCase() };

      for (const key in queryParams) {
        const raw = queryParams[key];
        const value = Array.isArray(raw) ? raw[0] : raw;

        if (value) {
          query[`keys.${key}`] = value.trim();
        }
      }

      let rec = await db.collection(recommendationsCollection).findOne(query);

      if (!rec) {
        rec = await db
          .collection(recommendationsCollection)
          .findOne({ slug: query.slug });
      }

      if (!rec) {
        rec = {
          title: "Personalized Guidance",
          description: "General recommendations based on your profile.",
          values: [
            "Stay consistent with healthy habits",
            "Focus on small improvements",
            "Build daily routines",
          ],
        };
      }

      return res.status(200).json(rec);
    }

    // ────────────────────────────────────────────────
    // POST → Send Email with Last Saved Result
    // ────────────────────────────────────────────────
    if (method === "POST" && req.query.mode === "send-email") {
      const { email, slug } = req.body;

      if (!email || !slug) {
        return res.status(400).json({ error: "Missing email or slug." });
      }

      // Fetch last entry for this slug
      let lastEntry = await db
        .collection(savedCollection)
        .find({ slug })
        .sort({ savedAt: -1 })
        .limit(1)
        .toArray();

      if (!lastEntry.length) {
        return res.status(404).json({
          error: "No saved quiz result found for this quiz.",
        });
      }

      let saved = lastEntry[0];

      // Assign email if missing
      if (!saved.email) {
        await db
          .collection(savedCollection)
          .updateOne({ _id: saved._id }, { $set: { email } });
        saved.email = email;
      }

      const resultId = saved._id.toString();

      // Generate email HTML
      let emailContent;
      try {
        emailContent = generateMainQuizEmail({
          slug,
          matchedTitle: saved.matchedTitle,
          matchedDescription: saved.matchedDescription,
          matchedValues: saved.matchedValues,
          answers: saved.answers,
          name: saved?.email?.split("@")[0] || "Wellness Member",
          updatedAt: new Date(saved.savedAt).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          resultId, // <<< IMPORTANT: added
        });
      } catch (e) {
        console.error("Email generation error:", e);
        return res
          .status(500)
          .json({ error: "Failed to generate email content." });
      }

      // Send email
      try {
        await sendEmail(email, emailContent.subject, emailContent.body);
      } catch (e) {
        console.error("Email send error:", e);
        return res.status(500).json({
          error: "Failed to send email.",
        });
      }

      return res.status(200).json({ message: "Email sent successfully." });
    }

    // ────────────────────────────────────────────────
    // POST → Save Quiz Result
    // ────────────────────────────────────────────────
    if (method === "POST") {
      const { slug, answers, email } = req.body;

      if (!slug || typeof slug !== "string" || !answers) {
        return res
          .status(400)
          .json({ error: "Missing or invalid slug or answers." });
      }

      const baseQuery = { slug: slug.trim().toLowerCase() };
      const query = { ...baseQuery };

      for (const [key, value] of Object.entries(answers)) {
        query[`keys.${key}`] = value;
      }

      let rec = await db.collection(recommendationsCollection).findOne(query);

      if (!rec) {
        rec = await db.collection(recommendationsCollection).findOne(baseQuery);
      }

      if (!rec) {
        rec = {
          title: "Personalized Guidance",
          description: "General recommendations based on your profile.",
          values: [
            "Build small daily habits",
            "Stay consistent",
            "Track your progress",
          ],
        };
      }

      const saveDoc = {
        slug: baseQuery.slug,
        email: email?.trim() || null,
        answers,
        savedAt: new Date(),
        matchedTitle: rec.title,
        matchedDescription: rec.description,
        matchedValues: rec.values,
      };

      const savedDoc = await db.collection(savedCollection).insertOne(saveDoc);

      return res.status(200).json({
        message: "Saved",
        result: saveDoc,
        resultId: savedDoc.insertedId.toString(), // <<< IMPORTANT
      });
    }

    return res.status(405).json({
      error: `Method ${method} not allowed.`,
    });
  } catch (error) {
    console.error("API internal error:", error);
    return res.status(500).json({
      error: "Internal server error",
      detail: error.message,
    });
  } finally {
    if (client) await client.close();
  }
}
