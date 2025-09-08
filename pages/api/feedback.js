// /pages/api/feedback.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "wellnesspurelife";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pageSlug, isPositive, comment = "", lang = "en" } = req.body;

  if (!pageSlug || typeof isPositive !== "boolean") {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const feedbackCollection = db.collection("page_feedback");

    await feedbackCollection.insertOne({
      pageSlug,
      isPositive,
      comment,
      lang,
      createdAt: new Date(),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ MongoDB Insert Error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}
