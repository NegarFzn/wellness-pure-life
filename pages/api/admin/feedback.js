import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const uri = process.env.MONGODB_URI;
const dbName = "wellnesspurelife";

// 🔐 Define your admin emails here
const ADMIN_EMAILS = ["info@wellnesspurelife.com", "negar.fozooni@gmail.com"];

let cachedClient = null;
async function connectToDB() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // 🔐 Only allow authenticated admins
  if (!session || !ADMIN_EMAILS.includes(session.user?.email)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pageSlug, startDate, endDate, voteType } = req.query;

  try {
    const client = await connectToDB();
    const db = client.db(dbName);
    const feedbackCollection = db.collection("page_feedback");

    const query = {};

    // ✅ Filter by pageSlug
    if (pageSlug) {
      query.pageSlug = pageSlug;
    }

    // ✅ Filter by date
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // include full end day
      query.createdAt = { $gte: start, $lte: end };
    }

    // ✅ Filter by voteType for feedback listing
    if (voteType === "positive") {
      query.isPositive = true;
    } else if (voteType === "negative") {
      query.isPositive = false;
    }

    // ✅ Get filtered feedback
    const feedback = await feedbackCollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    // 🧮 Compute vote stats within filtered time range (ignore voteType filter here!)
    const countQuery = { ...query };
    delete countQuery.isPositive; // remove vote filter to get both counts

    const [positiveCount, negativeCount] = await Promise.all([
      feedbackCollection.countDocuments({ ...countQuery, isPositive: true }),
      feedbackCollection.countDocuments({ ...countQuery, isPositive: false }),
    ]);

    const totalCount = positiveCount + negativeCount;

    return res.status(200).json({
      feedback,
      summary: {
        total: totalCount,
        positive: positiveCount,
        negative: negativeCount,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching feedback:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
