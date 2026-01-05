import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
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

    // ✅ TYPE: "weekly" | "daily"
    // ✅ DEFAULT FIXED TO DAILY (weekly CODE NOT TOUCHED)
    const type = req.query.type || "daily";
    const isDaily = type === "daily";

    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();

    const historyCollection = db.collection(
      isDaily ? "daily_routine_history" : "weekly_plan_history"
    );

    const favoritesCollection = db.collection(
      isDaily ? "daily_routine_favorites" : "weekly_plan_favorites"
    );

    /** ------------------------------
     *  LOAD HISTORY (with _id kept)
     * ------------------------------ */
    const [items, total] = await Promise.all([
      historyCollection
        .find({ email })
        .sort({ savedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),

      historyCollection.countDocuments({ email }),
    ]);

    /** ------------------------------
     *  ✅ LOAD FAVORITES BY CORRECT DAILY ID
     *  (ONLY DAILY FIXED — WEEKLY UNTOUCHED)
     * ------------------------------ */
    const favDocs = await favoritesCollection.find({ email }).toArray();

    const favIds = favDocs.map((fav) =>
      String(isDaily ? fav.routineId || fav.favoriteId || fav._id : fav.planId)
    );

    /** ------------------------------
     *  ADD isFavorite FLAG + NORMALIZE
     * ------------------------------ */
    const enrichedItems = items.map((item) => {
      const id = String(item._id);

      if (isDaily) {
        return {
          ...item,
          _id: id,
          isFavorite: favIds.includes(id),

          // ✅ Normalize daily routine shape:
          // { Morning, Midday, Evening }
          dailyRoutine: item.dailyRoutine?.blocks || item.dailyRoutine || {},

          type: "daily",
        };
      } else {
        // ✅ WEEKLY CODE — NOT TOUCHED
        return {
          ...item,
          _id: id,
          isFavorite: favIds.includes(id),

          // ✅ Normalize weekly plan shape:
          // { Monday, Tuesday, ... }
          weeklyPlan: item.weeklyPlan?.days || item.weeklyPlan || {},

          type: "weekly",
        };
      }
    });

    return res.status(200).json({
      items: enrichedItems,
      page,
      limit,
      total,
      type,
    });
  } catch (err) {
    console.error("Plan History API Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
