import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "wellnesspurelife";
const questionsCollection = "quiz_plan_questions";
const recommendationsCollection = "quiz_plan_recommendations";
const savedCollection = "quiz_plan_saved";

export default async function handler(req, res) {
  let client;

  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const method = req.method.toUpperCase();

    // ────────────────────────────────────────────────
    // ✅ GET (mode=questions): Return all quiz questions
    // ────────────────────────────────────────────────
    if (method === "GET" && req.query.mode === "questions") {
      const quizzes = await db
        .collection(questionsCollection)
        .find({}, { projection: { _id: 0 } })
        .toArray();
      return res.status(200).json(quizzes);
    }

    // ✅ GET (mode=history): Return all saved plans for user
    if (method === "GET" && req.query.mode === "history") {
      const email = req.query.email?.trim();
      if (!email) {
        return res.status(400).json({ error: "Missing 'email' parameter." });
      }

      const plans = await db
        .collection(savedCollection)
        .find({ email })
        .sort({ savedAt: -1 })
        .toArray();

      return res.status(200).json({ history: plans });
    }

    // ✅ GET (by slug and email): Load saved plan
    if (
      method === "GET" &&
      req.query.slug &&
      req.query.email &&
      Object.keys(req.query).length === 2
    ) {
      const result = await db.collection(savedCollection).findOne({
        slug: req.query.slug.trim().toLowerCase(),
        email: req.query.email.trim(),
      });

      if (!result) {
        return res.status(404).json({ error: "No saved plan found." });
      }

      const { _id, ...cleaned } = result;
      return res.status(200).json(cleaned);
    }

    // ✅ GET (with answers): Return matched fitness plan
    if (method === "GET") {
      const { slug, ...queryParams } = req.query;

      if (!slug || Object.keys(queryParams).length === 0) {
        return res
          .status(400)
          .json({ error: "Missing 'slug' or answer parameters." });
      }

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
        return res
          .status(404)
          .json({ error: "No matching fitness plan found." });
      }

      const { _id, ...cleaned } = rec;
      return res.status(200).json(cleaned);
    }

    // ✅ POST: Save answers and return matched fitness plan
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
        matchedPlan: rec?.plan || null,
      };

      await db.collection(savedCollection).insertOne(saveDoc);

      return res.status(200).json({
        message: "Saved",
        result: saveDoc,
      });
    }

    // ❌ Unsupported HTTP Method
    return res.status(405).json({ error: `Method ${method} not allowed.` });
  } catch (error) {
    console.error("❌ API error:", error);
    return res.status(500).json({ error: "Internal server error." });
  } finally {
    if (client) await client.close();
  }
}
