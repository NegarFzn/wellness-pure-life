import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { connectToDatabase } from "../../utils/mongodb";
import { sendEmail } from "../../utils/email";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    /* ================= EMAIL MODE ================= */
    if (req.query.mode === "emails") {
      const users = await db
        .collection("users")
        .find({
          "dailyRitualEmail.enabled": true,
          $or: [
            { "dailyRitualEmail.lastSentDate": { $ne: today } },
            { "dailyRitualEmail.lastSentDate": { $exists: false } },
          ],
        })
        .toArray();

      let sent = 0;

      for (const user of users) {
        const ritual = await db
          .collection("daily_ritual_premium")
          .aggregate([{ $sample: { size: 1 } }])
          .toArray();

        const ritualText = ritual?.[0]?.text || "Take 5 slow breaths.";

        await sendEmail(
          user.email,
          "Your Daily Wellness Ritual",
          `<p>${ritualText}</p>`
        );

        await db.collection("users").updateOne(
          { email: user.email },
          { $set: { "dailyRitualEmail.lastSentDate": today } }
        );

        sent++;
      }

      return res.json({ success: true, sent });
    }

    /* ================= SESSION ================= */
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ locked: true });
    }

    const email = session.user.email.toLowerCase().trim();

    const user = await db.collection("users").findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    if (!user?.isPremium) {
      return res.json({ locked: true });
    }

    const ritualState = user.dailyRitual || {};
    const lastDate = ritualState.lastCompletedDate || null;
    const streak = ritualState.streak || 0;
    const assignedDate = ritualState.assignedDate || null;
    const ritualId = ritualState.ritualId || null;

    /* ================= GET ================= */
    if (req.method === "GET") {
      let ritualText = "Take a calm breath.";

      let activeRitualId = ritualId;

      // 🔹 If no ritual assigned today, pick and save one
      if (assignedDate !== today || !ritualId) {
        const ritual = await db
          .collection("daily_ritual_premium")
          .aggregate([{ $sample: { size: 1 } }])
          .toArray();

        if (ritual[0]) {
          activeRitualId = ritual[0]._id.toString();
          ritualText = ritual[0].text;

          await db.collection("users").updateOne(
            { email: user.email },
            {
              $set: {
                "dailyRitual.assignedDate": today,
                "dailyRitual.ritualId": activeRitualId,
              },
            }
          );
        }
      } else {
        // 🔹 Load same ritual for today
        const saved = await db
          .collection("daily_ritual_premium")
          .findOne({ _id: new ObjectId(ritualId) });

        ritualText = saved?.text || ritualText;
      }

      const hasCompletedToday = lastDate === today;

      return res.json({
        locked: false,
        hasCompleted: hasCompletedToday,
        message: ritualText,
        streak,
      });
    }

    /* ================= POST ================= */
    if (req.method === "POST") {
      if (lastDate === today) {
        return res.json({ locked: true, hasCompleted: true, streak });
      }

      const newStreak = lastDate === yesterday ? streak + 1 : 1;

      await db.collection("users").updateOne(
        { email: user.email },
        {
          $set: {
            "dailyRitual.lastCompletedDate": today,
            "dailyRitual.streak": newStreak,
          },
        }
      );

      return res.json({
        locked: true,
        hasCompleted: true,
        streak: newStreak,
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
