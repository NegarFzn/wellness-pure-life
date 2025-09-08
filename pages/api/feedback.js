// /pages/api/feedback.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "wellnesspurelife";
const options = {};

// 🔄 Global caching for serverless environments (e.g. Vercel)
let cachedClient = global._mongoClient;
let cachedDb = global._mongoDb;

if (!cachedClient) {
  cachedClient = null;
  cachedDb = null;
}

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri, options);
  const db = client.db(dbName);

  global._mongoClient = client;
  global._mongoDb = db;

  return { client, db };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pageSlug, isPositive, comment = "", lang = "en" } = req.body;

  if (!pageSlug || typeof isPositive !== "boolean") {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { db } = await connectToDatabase();
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
