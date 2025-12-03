import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../utils/mongodb";
import { generateWeeklyPlan } from "../../../lib/plan/generateWeeklyPlan";

// Ensure premium is always boolean
function normalizeIsPremium(value) {
  if (value === true) return true;
  if (value === "true") return true;
  if (value === 1) return true;
  return false;
}

export default async function handler(req, res) {
  try {
    // 1. Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // 2. Normalize and enforce premium
    const isPremium = normalizeIsPremium(session.user.isPremium);
    if (!isPremium) {
      return res.status(403).json({ error: "Premium required" });
    }

    const email = session.user.email;

    // Connect to Mongo
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // --------------------------------
    // GET — fetch existing weekly plan
    // --------------------------------
    if (req.method === "GET") {
      const userPlan = await db.collection("userPlans").findOne({ email });

      return res.status(200).json({
        plan: userPlan?.weeklyPlan || null,
        updatedAt: userPlan?.weeklyPlanUpdatedAt || null,
      });
    }

    console.log("API SESSION:", session.user);


    // --------------------------------
    // POST — generate new weekly plan
    // --------------------------------
    if (req.method === "POST") {
      const userProfile = await db.collection("users").findOne({ email });

      const quizData = await db
        .collection("quizResults")
        .find({ userEmail: email })
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray();

      const latestQuiz = quizData[0] || {};

      // Generate AI weekly plan
      const plan = await generateWeeklyPlan(userProfile, latestQuiz);

      // Save to MongoDB
      await db.collection("userPlans").updateOne(
        { email },
        {
          $set: {
            weeklyPlan: plan,
            weeklyPlanUpdatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );

      return res.status(200).json({ plan });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Weekly Plan API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
