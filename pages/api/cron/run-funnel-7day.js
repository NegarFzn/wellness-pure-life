import { connectToDatabase } from "../../../utils/mongodb";
import { sendEmail } from "../../../utils/email";
import { generateFunnel7DayContent } from "../../../emails/contentGenerator";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    console.log("✅ CONNECTED DB NAME:", db.databaseName);

    // FETCH USERS IN FUNNEL (EXCLUDE PREMIUM)
    const users = await db.collection("users").find({
      "funnel_7day.status": "active",
      "funnel_7day.day": { $lt: 7 },
      isPremium: { $ne: true },
    }).toArray();

    if (!users.length) {
      return res.status(200).json({
        message: "No pending users for 7-day funnel.",
        processed: 0,
      });
    }

    let modifiedTotal = 0;

    for (const user of users) {
      try {
        if (!user?.email || !user?.funnel_7day) continue;

        // SAFETY CHECK: user upgraded recently
        if (user.isPremium === true) {
          await db.collection("users").updateOne(
            { _id: user._id },
            { $set: { "funnel_7day.status": "stopped" } }
          );
          console.log("⛔ PREMIUM USER SKIPPED:", user.email);
          continue;
        }

        const email = user.email;

        // CLEAN NAME
        const userName =
          user.name ||
          email.split("@")[0].replace(/[^a-zA-Z]/g, "") ||
          "there";

        const dayIndex = user.funnel_7day.day;

        // GET EMAIL CONTENT
        const { subject, htmlContent } = generateFunnel7DayContent(
          dayIndex,
          userName
        );

        if (!subject || !htmlContent) {
          console.error("❌ Missing content for day:", dayIndex, "email:", email);
          continue;
        }

        // SEND EMAIL
        await sendEmail(email, subject, htmlContent);

        // UPDATE FUNNEL DAY
        const nextDay = dayIndex + 1;

        const result = await db.collection("users").updateOne(
          { _id: user._id },
          {
            $set: {
              "funnel_7day.lastSentAt": new Date(),
              "funnel_7day.status": nextDay >= 7 ? "completed" : "active",
            },
            $inc: { "funnel_7day.day": 1 },
          }
        );

        console.log(
          `📨 SENT DAY ${dayIndex} → ${email} | UPDATED: ${result.modifiedCount}`
        );

        if (result.modifiedCount === 1) modifiedTotal++;

      } catch (err) {
        console.error("❌ FUNNEL EMAIL FAILED FOR:", user?.email, err);
      }
    }

    return res.status(200).json({
      message: "7-day funnel executed successfully.",
      found: users.length,
      updated: modifiedTotal,
    });

  } catch (error) {
    console.error("❌ FUNNEL RUN ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
