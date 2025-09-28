import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "wellnesspurelife";
const questionsCollection = "quiz_plan_questions";
const recommendationsCollection = "quiz_plan_recommendations";
const savedCollection = "quiz_plan_saved";

// 🔧 normalize answers to strings
function normalize(obj) {
  const norm = {};
  for (const k in obj) {
    norm[k] = obj[k]?.toString().trim();
  }
  return norm;
}

// 🔧 build MongoDB query from keys
function buildQuery(slug, answers) {
  const normalized = normalize(answers);
  return {
    slug: slug.trim().toLowerCase(),
    ...Object.fromEntries(
      Object.entries(normalized).map(([k, v]) => [`keys.${k}`, v])
    ),
  };
}


export default async function handler(req, res) {
  let client;

  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const method = req.method.toUpperCase();

    // ───────────────────────────────
    // ✅ GET (mode=questions)
    // ───────────────────────────────
    if (method === "GET" && req.query.mode === "questions") {
      const quizzes = await db
        .collection(questionsCollection)
        .find({}, { projection: { _id: 0 } })
        .toArray();
      return res.status(200).json(quizzes);
    }

    // ✅ GET (mode=history): all saved plans for a user
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

    // ✅ GET (by slug and email): load latest saved plan
    if (
      method === "GET" &&
      req.query.slug &&
      req.query.email &&
      Object.keys(req.query).length === 2
    ) {
      const slug = req.query.slug.trim().toLowerCase();
      const email = req.query.email.trim();

      const result = await db
        .collection(savedCollection)
        .findOne({ slug, email }, { sort: { savedAt: -1 } });

      if (!result) {
        return res.status(404).json({ error: "No saved plan found." });
      }

      const { _id, ...cleaned } = result;
      return res.status(200).json(cleaned); // ❌ Do not re-match
    }

    // ✅ GET (with answers in query params): dynamic match
    if (method === "GET") {
      const { slug, ...queryParams } = req.query;

      if (!slug || Object.keys(queryParams).length === 0) {
        return res
          .status(400)
          .json({ error: "Missing 'slug' or answer parameters." });
      }

      const query = buildQuery(slug, queryParams);
      const match = await db
        .collection(recommendationsCollection)
        .findOne(query);

      if (!match) {
        return res
          .status(404)
          .json({ error: `No matching plan found for slug ${slug}.` });
      }

      const { _id, ...cleaned } = match;
      return res.status(200).json(cleaned);
    }

    // ✅ POST: save answers and matched plan
    if (method === "POST") {
      const { slug, answers, email } = req.body;
      console.log(slug, answers)

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

      const normalizedSlug = slug.trim().toLowerCase();
      const query = buildQuery(normalizedSlug, answers);
      console.log(normalizedSlug, query)

      const match = await db
        .collection(recommendationsCollection)
        .findOne(query);

      console.log(match)



      const saveDoc = {
        slug: normalizedSlug,
        email: email?.trim() || null,
        answers,
        savedAt: new Date(),
        matchedPlan: match?.plan || null,
      };

      await db.collection(savedCollection).insertOne(saveDoc);

      return res.status(200).json({
        message: "Saved",
        result: saveDoc,
      });
    }

    // ❌ Unsupported
    return res.status(405).json({ error: `Method ${method} not allowed.` });
  } catch (error) {
    console.error("❌ API error:", error);
    return res.status(500).json({ error: "Internal server error." });
  } finally {
    if (client) await client.close();
  }
}
