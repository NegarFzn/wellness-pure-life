import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!session.user.isPremium) {
      return res.status(403).json({ error: "Premium required" });
    }

    const email = session.user.email;
    const { type, dataToRestore } = req.body;

    if (!type || !dataToRestore || typeof dataToRestore !== "object") {
      return res.status(400).json({ error: "Invalid restore payload" });
    }

    const { db } = await connectToDatabase();

    const isDaily = type === "daily";

    const activeCollection = db.collection(
      isDaily ? "daily_routines" : "weekly_plans"
    );

    const historyCollection = db.collection(
      isDaily ? "daily_routine_history" : "weekly_plan_history"
    );

    const now = new Date().toISOString();

    // ======================================================
    // 1. LOAD CURRENT ACTIVE ITEM
    // ======================================================
    const current = await activeCollection.findOne({ email });

    // ======================================================
    // 2. NORMALIZE RESTORED DATA
    // ======================================================
    let restored = isDaily
      ? dataToRestore.dailyRoutine
      : dataToRestore.weeklyPlan;

    if (Array.isArray(restored)) {
      restored = Object.fromEntries(
        restored.map((x) => [isDaily ? x.block : x.day, x])
      );
    }

    if (
      restored?.[isDaily ? "blocks" : "days"] &&
      Array.isArray(restored[isDaily ? "blocks" : "days"])
    ) {
      restored = Object.fromEntries(
        restored[isDaily ? "blocks" : "days"].map((x) => [
          isDaily ? x.block : x.day,
          x,
        ])
      );
    }

    if (!restored || typeof restored !== "object") {
      return res.status(400).json({ error: "Malformed restore data" });
    }

    // ======================================================
    // 3. SAVE CURRENT INTO HISTORY IF DIFFERENT
    // ======================================================
    const currentData = isDaily ? current?.dailyRoutine : current?.weeklyPlan;

    if (currentData) {
      const isSame =
        JSON.stringify(currentData) === JSON.stringify(restored);

      if (!isSame) {
        await historyCollection.insertOne({
          email,
          ...(isDaily
            ? {
                dailyRoutine: current.dailyRoutine,
                daySummary: current.daySummary || "",
              }
            : {
                weeklyPlan: current.weeklyPlan,
                weekSummary: current.weekSummary || "",
              }),
          updatedAt: current.updatedAt || null,
          restoredAt: now,
        });
      }
    }

    // ======================================================
    // 4. REPLACE ACTIVE DATA
    // ======================================================
    await activeCollection.updateOne(
      { email },
      {
        $set: {
          ...(isDaily
            ? {
                dailyRoutine: restored,
                daySummary: dataToRestore.daySummary || "",
              }
            : {
                weeklyPlan: restored,
                weekSummary: dataToRestore.weekSummary || "",
              }),
          updatedAt: now,
        },
      },
      { upsert: true }
    );

    return res.status(200).json({
      success: true,
      restored: now,
    });
  } catch (err) {
    console.error("Restore API Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
