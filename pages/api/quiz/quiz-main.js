import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "wellnesspurelife";
const recommendationsCollection = "quiz_main_recommendations";
const questionsCollection = "quiz_main_questions";
const savedCollection = "quiz_main_saved";

export default async function handler(req, res) {
  let client;

  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const method = req.method.toUpperCase();

    // ────────────────────────────────────────────────
    // ✅ GET (mode=questions): Return all quiz questions
    // http://localhost:3000/api/quiz/quiz-main?mode=questions
    // ────────────────────────────────────────────────
    if (method === "GET" && req.query.mode === "questions") {
      const quizzes = await db
        .collection(questionsCollection)
        .find({}, { projection: { _id: 0 } })
        .toArray();
      return res.status(200).json(quizzes);
    }

    // ────────────────────────────────────────────────
    // ✅ GET (with answers): Return matched recommendation
    // http://localhost:3000/api/quiz/quiz-main?slug=fitness&goal=Lose%20weight&activityLevel=Sedentary&location=Home&frequency=2
    // ────────────────────────────────────────────────
    if (method === "GET") {
      const { slug, ...queryParams } = req.query;

      if (!slug || Object.keys(queryParams).length === 0) {
        return res
          .status(400)
          .json({ error: "Missing 'slug' or answer parameters." });
      }

      // Normalize and extract key-value pairs
      const keysObject = {};
      for (const key in queryParams) {
        const raw = queryParams[key];
        const value = Array.isArray(raw) ? raw[0] : raw;
        keysObject[key] = value?.trim?.();
      }

      const rec = await db.collection(recommendationsCollection).findOne({
        slug: slug.trim().toLowerCase(),
        keys: keysObject,
      });

      if (!rec) {
        return res.status(404).json({ error: "No recommendation found." });
      }

      const { _id, ...cleaned } = rec;
      return res.status(200).json(cleaned);
    }

    // ────────────────────────────────────────────────
    // ✅ POST: Save answers and return matched recommendation
    // ────────────────────────────────────────────────
    if (method === "POST") {
      const { slug, answers, email } = req.body;

      if (
        !slug ||
        typeof slug !== "string" ||
        !answers ||
        typeof answers !== "object"
      ) {
        return res
          .status(400)
          .json({ error: "Missing or invalid 'slug' or 'answers'." });
      }

      const rec = await db.collection(recommendationsCollection).findOne({
        slug: slug.trim().toLowerCase(),
        keys: answers,
      });

      const saveDoc = {
        slug: slug.trim().toLowerCase(),
        email: email?.trim() || null,
        answers,
        savedAt: new Date(),
        matchedTitle: rec?.title || null,
        matchedDescription: rec?.description || null,
        matchedValues: rec?.values || null,
      };

      await db.collection(savedCollection).insertOne(saveDoc);

      return res.status(200).json({
        message: "Saved",
        result: saveDoc,
      });
    }

    // ────────────────────────────────────────────────
    // ❌ Unsupported HTTP Method
    // ────────────────────────────────────────────────
    return res.status(405).json({ error: `Method ${method} not allowed.` });
  } catch (error) {
    console.error("❌ API error:", error);
    return res.status(500).json({ error: "Internal server error." });
  } finally {
    if (client) await client.close();
  }
}
