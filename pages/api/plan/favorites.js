import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "../../../utils/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    // 1. AUTH CHECK
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!session.user.isPremium) {
      return res.status(403).json({ error: "Premium required" });
    }

    const email = session.user.email;

    // ✅ TYPE: "weekly" | "daily"
    const type = req.method === "GET"
      ? req.query.type || "weekly"
      : req.body.type || "weekly";

    const isDaily = type === "daily";

    // 2. DB COLLECTIONS (DYNAMIC)
    const { db } = await connectToDatabase();

    const favoritesCollection = db.collection(
      isDaily ? "daily_routine_favorites" : "weekly_plan_favorites"
    );

    // ------------------------------------------------------------------
    // ✅ GET — return all favorites (weekly OR daily)
    // ------------------------------------------------------------------
    if (req.method === "GET") {
      const docs = await favoritesCollection
        .find({ email })
        .sort({ favoritedAt: -1 })
        .toArray();

      const favorites = docs.map((doc) => {
        const snapshot = doc.planSnapshot || doc.routineSnapshot || doc.plan || doc.routine || {};

        if (isDaily) {
          const dailyRoutine = snapshot.dailyRoutine || snapshot;
          const morning = dailyRoutine.Morning || snapshot.Morning || null;

          return {
            favoriteId: doc._id.toString(),
            routineId: doc.routineId || (snapshot._id && snapshot._id.toString()) || null,
            updatedAt: snapshot.updatedAt || null,
            daySummary: snapshot.daySummary || "",
            Morning: morning,
            favoritedAt: doc.favoritedAt || null,
            routine: snapshot, // ✅ full snapshot for restore
            type: "daily",
          };
        } else {
          const weeklyPlan = snapshot.weeklyPlan || snapshot;
          const monday = weeklyPlan.Monday || snapshot.Monday || null;

          return {
            favoriteId: doc._id.toString(),
            planId: doc.planId || (snapshot._id && snapshot._id.toString()) || null,
            updatedAt: snapshot.updatedAt || null,
            weekSummary: snapshot.weekSummary || "",
            Monday: monday,
            favoritedAt: doc.favoritedAt || null,
            plan: snapshot, // ✅ full snapshot for restore
            type: "weekly",
          };
        }
      });

      return res.status(200).json({ favorites });
    }

    // ------------------------------------------------------------------
    // ✅ POST — add favorite (WEEKLY or DAILY)
    // ------------------------------------------------------------------
    if (req.method === "POST") {
      const payload = isDaily ? req.body.routine : req.body.plan;

      if (!payload || !payload._id) {
        return res.status(400).json({
          error: isDaily ? "Missing routine._id" : "Missing plan._id",
        });
      }

      const itemId = payload._id.toString();

      const exists = await favoritesCollection.findOne({
        email,
        [isDaily ? "routineId" : "planId"]: itemId,
      });

      if (exists) {
        return res.status(409).json({ error: "already_favorite" });
      }

      await favoritesCollection.insertOne({
        email,
        [isDaily ? "routineId" : "planId"]: itemId,
        [isDaily ? "routineSnapshot" : "planSnapshot"]: payload,
        favoritedAt: new Date().toISOString(),
      });

      return res.status(200).json({ success: true });
    }

    // ------------------------------------------------------------------
    // ✅ DELETE — remove favorite by favoriteId (weekly OR daily)
    // ------------------------------------------------------------------
    if (req.method === "DELETE") {
      const { favoriteId } = req.body;

      if (!favoriteId) {
        return res.status(400).json({ error: "Missing favoriteId" });
      }

      const result = await favoritesCollection.deleteOne({
        _id: new ObjectId(favoriteId),
        email,
      });

      if (!result.deletedCount) {
        return res.status(404).json({ error: "Favorite not found" });
      }

      return res.status(200).json({ success: true });
    }

    // ------------------------------------------------------------------
    // METHOD NOT ALLOWED
    // ------------------------------------------------------------------
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Favorites API Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
