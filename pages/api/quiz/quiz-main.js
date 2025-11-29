import { MongoClient } from "mongodb";

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
    // ✅ GET (mode=questions)
    // ────────────────────────────────────────────────
    if (method === "GET" && req.query.mode === "questions") {
      const quizzes = await db
        .collection(questionsCollection)
        .find({}, { projection: { _id: 0 } })
        .toArray();
      return res.status(200).json(quizzes);
    }

    // ────────────────────────────────────────────────
    // ✅ GET (mode=saved)
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
    // ✅ GET (match by answers)
    // ────────────────────────────────────────────────
    if (method === "GET" && !req.query.mode) {
      const { slug, ...queryParams } = req.query;

      if (!slug) {
        return res
          .status(400)
          .json({ error: "Missing 'slug' or answer parameters." });
      }

      const query = {
        slug: slug.trim().toLowerCase(),
      };

      // ✅ Dynamic key matching
      for (const key in queryParams) {
        const raw = queryParams[key];
        const value = Array.isArray(raw) ? raw[0] : raw;
        if (value) {
          query[`keys.${key}`] = value.trim();
        }
      }

      let rec = await db.collection(recommendationsCollection).findOne(query);

      // ✅ Fallback by slug only
      if (!rec) {
        rec = await db
          .collection(recommendationsCollection)
          .findOne({ slug: query.slug });
      }

      // ✅ Default fallback
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
    // ✅ POST
    // ────────────────────────────────────────────────
    if (method === "POST") {
      const { slug, answers, email } = req.body;

      if (!slug || typeof slug !== "string" || !answers) {
        return res
          .status(400)
          .json({ error: "Missing or invalid 'slug' or 'answers'." });
      }

      const baseQuery = {
        slug: slug.trim().toLowerCase(),
      };

      const query = { ...baseQuery };

      for (const [key, value] of Object.entries(answers)) {
        query[`keys.${key}`] = value;
      }

      let rec = await db.collection(recommendationsCollection).findOne(query);

      // ✅ Fallbacks
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

      await db.collection(savedCollection).insertOne(saveDoc);

      return res.status(200).json({
        message: "Saved",
        result: saveDoc,
      });
    }

    return res.status(405).json({ error: `Method ${method} not allowed.` });
  } catch (error) {
    console.error("❌ API error:", error);
    return res.status(500).json({
      error: "Internal server error",
      detail: error.message,
    });
  } finally {
    if (client) await client.close();
  }
}
