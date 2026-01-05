import { MongoClient } from "mongodb";
import { sendEmail } from "../../../utils/email";
import { generateQuizPlanEmail } from "../../../emails/contentGenerator";

const uri = process.env.MONGODB_URI;
const dbName = "wellnesspurelife";

const questionsCollection = "quiz_plan_questions";
const recommendationsCollection = "quiz_plan_recommendations";
const savedCollection = "quiz_plan_saved";

// -----------------------------
// Utility helpers
// -----------------------------
function normalize(obj) {
  const norm = {};
  for (const k in obj) {
    norm[k] = obj[k]?.toString().trim();
  }
  return norm;
}

function buildQuery(slug, answers) {
  const normalized = normalize(answers);
  return {
    slug: slug.trim().toLowerCase(),
    ...Object.fromEntries(
      Object.entries(normalized).map(([k, v]) => [`keys.${k}`, v])
    ),
  };
}

// -----------------------------
// MAIN HANDLER
// -----------------------------
export default async function handler(req, res) {
  let client;

  try {
    client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const method = req.method.toUpperCase();

    //
    // ================================================
    // 1) SEND EMAIL (POST mode=email)
    // ================================================
    //
    if (method === "POST" && req.query.mode === "email") {
      const { email, name, answers, category, matchedPlan } = req.body;

      if (!email || !category || !answers) {
        return res.status(400).json({ error: "Missing or invalid fields" });
      }

      try {
        const normalizedCategory = category.replace(/-plan$/, "").toLowerCase();

        const displayAnswers = Object.fromEntries(
          Object.entries(answers).map(([k, v]) => {
            if (typeof v === "string") {
              return [
                k,
                v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
              ];
            }
            return [k, v];
          })
        );

        const { subject, body: htmlBody } = generateQuizPlanEmail({
          name: (name || email?.split("@")[0] || "User").trim(),
          category: normalizedCategory,
          matchedPlan: matchedPlan || {}, // <-- SAFETY FIX
          displayAnswers,
        });

        await sendEmail(email, subject, htmlBody);

        return res.status(200).json({ message: "Email sent successfully." });
      } catch (err) {
        console.error("❌ Email send failed:", err.message, err);
        return res.status(500).json({ error: "Email send failed." });
      }
    }

    //
    // ================================================
    // 2) GET QUESTIONS
    // ================================================
    //
    if (method === "GET" && req.query.mode === "questions") {
      const quizzes = await db
        .collection(questionsCollection)
        .find({}, { projection: { _id: 0 } })
        .toArray();

      return res.status(200).json(quizzes);
    }

    //
    // ================================================
    // 3) GET HISTORY
    // ================================================
    //
    if (method === "GET" && req.query.mode === "history") {
      const email = req.query.email?.trim();
      if (!email) return res.status(400).json({ error: "Missing email" });

      const plans = await db
        .collection(savedCollection)
        .find({ email })
        .sort({ savedAt: -1 })
        .toArray();

      return res.status(200).json({ history: plans });
    }

    //
    // ================================================
    // 4) GET LATEST SAVED PLAN (slug + email)
    // ================================================
    //
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

      if (!result)
        return res.status(404).json({ error: "No saved plan found" });

      const { _id, ...cleaned } = result;
      return res.status(200).json(cleaned);
    }

    //
    // ================================================
    // 5) GET MATCHED PLAN (dynamic based on answers)
    // ================================================
    //
    if (
      method === "GET" &&
      !req.query.mode && // NOT questions or history or others
      req.query.slug && // require slug
      Object.keys(req.query).length > 1
    ) {
      const { slug, ...queryParams } = req.query;

      if (!slug || Object.keys(queryParams).length === 0) {
        return res
          .status(400)
          .json({ error: "Missing slug or answer parameters" });
      }

      const query = buildQuery(slug, queryParams);

      const match = await db
        .collection(recommendationsCollection)
        .findOne(query);

      if (!match) {
        return res
          .status(404)
          .json({ error: `No matching plan found for slug ${slug}` });
      }

      const { _id, ...cleaned } = match;
      return res.status(200).json(cleaned);
    }

    //
    // ================================================
    // 6) SAVE PLAN (POST)
    // ================================================
    //
    if (method === "POST" && (!req.query.mode || req.query.mode === "save")) {
      const { slug, answers, email } = req.body;

      if (!slug || typeof slug !== "string" || !answers) {
        return res
          .status(400)
          .json({ error: "Missing or invalid slug or answers" });
      }

      const normalizedSlug = slug.trim().toLowerCase();
      const query = buildQuery(normalizedSlug, answers);

      const match = await db
        .collection(recommendationsCollection)
        .findOne(query);

      const saveDoc = {
        slug: normalizedSlug,
        email: email?.trim() || null,
        answers,
        savedAt: new Date(),
        matchedPlan: match?.plan || match || null,
      };

      await db.collection(savedCollection).insertOne(saveDoc);

      return res.status(200).json({
        message: "Saved",
        result: saveDoc,
      });
    }

    //
    // ================================================
    // 7) UNSUPPORTED METHOD
    // ================================================
    //
    return res.status(405).json({ error: `Method ${method} not allowed` });
  } catch (error) {
    console.error("❌ API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    if (client) await client.close();
  }
}
