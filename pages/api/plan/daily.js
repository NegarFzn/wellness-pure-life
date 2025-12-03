import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../utils/mongodb";
import { generateDailyPlan } from "../../../lib/plan/generateDailyPlan";

export default async function handler(req, res) {
  try {
    // 1. Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // 2. Check premium
    if (!session.user.isPremium) {
      return res.status(403).json({ error: "Premium required" });
    }

    const email = session.user.email;

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // --------------------------------------------------
    // GET — return existing plan
    // --------------------------------------------------
    if (req.method === "GET") {
      const userPlan = await db.collection("userPlans").findOne({ email });

      return res.status(200).json({
        plan: userPlan?.dailyPlan || null,
        updatedAt: userPlan?.dailyPlanUpdatedAt || null,
      });
    }

    // --------------------------------------------------
    // POST — generate new daily plan
    // --------------------------------------------------
    if (req.method === "POST") {
      const userProfile = await db.collection("users").findOne({ email });

      const quizData = await db
        .collection("quizResults")
        .find({ userEmail: email })
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray();

      const latestQuiz = quizData[0] || {};

      // Generate AI plan
      const plan = await generateDailyPlan(userProfile, latestQuiz);

      // Save to MongoDB
      await db.collection("userPlans").updateOne(
        { email },
        {
          $set: {
            dailyPlan: plan,
            dailyPlanUpdatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );

      return res.status(200).json({ plan });
    }

    // Unsupported HTTP methods
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Daily Plan API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
