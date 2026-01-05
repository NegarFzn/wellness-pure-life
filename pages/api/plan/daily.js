import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "../../../utils/mongodb";
import { generateDailyPlanEmail } from "../../../emails/contentGenerator";
import { sendEmail } from "../../../utils/email";
import { generateDailyRoutine } from "../../../lib/plan/generateDailyRoutine";



export default async function handler(req, res) {
  try {
    console.log("➡️ DAILY API: Request received", {
      method: req.method,
      query: req.query,
    });

    /* ----------------------------------------------
       1) AUTH CHECK
    ---------------------------------------------- */
    const session = await getServerSession(req, res, authOptions);
    console.log("➡️ Session:", session);

    if (!session || !session.user?.email) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const email = session.user.email;
    console.log("➡️ User email:", email);

    /* ----------------------------------------------
       2) MONGO + PREMIUM CHECK
    ---------------------------------------------- */
    const { db } = await connectToDatabase();
    console.log("➡️ Mongo connected");

    const usersCol = db.collection("users");
    const routineCol = db.collection("daily_routines");
    const historyCol = db.collection("daily_routine_history");

    console.log("➡️ Collections loaded");

    const mongoUser = await usersCol.findOne({ email });
    console.log("➡️ Mongo user:", mongoUser);

    if (!mongoUser || mongoUser.isPremium !== true) {
      return res.status(403).json({ error: "Premium required" });
    }

    /* ==============================================
       3) POST /?action=email → SEND DAILY EMAIL
    ================================================ */
    if (req.method === "POST" && req.query.action === "email") {
      console.log("➡️ EMAIL ACTION triggered");

      const existing = await routineCol.findOne({ email });
      console.log("➡️ Routine loaded:", existing);

      if (!existing) {
        return res.status(400).json({
          error: "No routine exists to send. Generate first.",
        });
      }

      const now = new Date();
      const lastEmailSent = existing.lastEmailSentAt;

      // EMAIL RATE LIMIT: 1 minute cooldown
      if (lastEmailSent) {
        const last = new Date(lastEmailSent);
        const diffMinutes = (now - last) / 1000 / 60;

        if (diffMinutes < 1) {
          return res.status(400).json({
            error: `Please wait ${Math.ceil(
              1 - diffMinutes
            )} minute before sending again.`,
          });
        }
      }

      // BUILD EMAIL
      // BUILD EMAIL (NEW SYNTAX)
      const { subject, html } = generateDailyPlanEmail({
        routine: existing,
        name: mongoUser.name || email.split("@")[0],
      });

      console.log("➡️ Sending email…");

      // SEND EMAIL
      await sendEmail(email, subject, html);

      // STORE TIMESTAMP
      await routineCol.updateOne(
        { email },
        { $set: { lastEmailSentAt: now.toISOString() } }
      );

      console.log("➡️ Email sent + timestamp updated");

      return res.status(200).json({ success: true, message: "Email sent" });
    }

    /* ==============================================
       4) GET → RETURN EXISTING ROUTINE OR CREATE NEW
    ================================================ */
    if (req.method === "GET") {
      console.log("➡️ GET daily routine for:", email);

      let routineDoc = await routineCol.findOne({ email });
      console.log("➡️ Found routine:", routineDoc);

      const malformed =
        !routineDoc ||
        !routineDoc.dailyRoutine ||
        typeof routineDoc.dailyRoutine !== "object";

      if (malformed) {
        console.log("✨ Creating first daily routine…");

        const ai = await generateDailyRoutine();
        const nowIso = new Date().toISOString();

        const doc = {
          email,
          dailyRoutine: ai.dailyRoutine,
          daySummary: ai.daySummary || "",
          quote: ai.quote || "",
          quoteAuthor: ai.quoteAuthor || "",
          mentorTip: ai.mentorTip || "",
          updatedAt: nowIso,
          lastEmailSentAt: null,
        };

        await routineCol.updateOne({ email }, { $set: doc }, { upsert: true });

        return res.status(200).json(doc);
      }

      return res.status(200).json(routineDoc);
    }

    /* ==============================================
       5) POST → GENERATE NEW ROUTINE (ONLY NEXT DAY)
    ================================================ */
    if (req.method === "POST" && !req.query.action) {
      console.log("➡️ Regenerate request for:", email);

      const existing = await routineCol.findOne({ email });
      console.log("➡️ Existing routine:", existing);

      const now = new Date();

      // Block regeneration if the previous routine is still the same UTC day
      // Block regeneration if the previous routine was generated on the same UTC day
      if (existing?.updatedAt) {
        const last = new Date(existing.updatedAt);

        const lastDay = Date.UTC(
          last.getUTCFullYear(),
          last.getUTCMonth(),
          last.getUTCDate()
        );

        const nowDay = Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate()
        );

        if (nowDay === lastDay) {
          return res.status(400).json({
            error: "You can regenerate your daily routine again tomorrow.",
          });
        }
      }

      // Save previous → history
      if (existing?.dailyRoutine) {
        console.log("➡️ Saving previous routine to history");

        const { _id, ...rest } = existing;

        await historyCol.insertOne({
          email,
          ...rest,
          savedAt: now.toISOString(),
        });
      }

      // Generate new routine
      console.log("➡️ Generating new AI routine…");

      const ai = await generateDailyRoutine();
      const nowIso = now.toISOString();

      const updated = {
        dailyRoutine: ai.dailyRoutine,
        daySummary: ai.daySummary || "",
        quote: ai.quote || "",
        quoteAuthor: ai.quoteAuthor || "",
        mentorTip: ai.mentorTip || "",
        updatedAt: nowIso,
      };

      await routineCol.updateOne(
        { email },
        { $set: updated },
        { upsert: true }
      );

      console.log("➡️ New routine saved");

      return res.status(200).json({
        dailyRoutine: ai.dailyRoutine,
        daySummary: ai.daySummary,
        quote: ai.quote,
        quoteAuthor: ai.quoteAuthor,
        mentorTip: ai.mentorTip,
        updatedAt: nowIso,
      });
    }

    /* ----------------------------------------------
       INVALID METHOD
    ---------------------------------------------- */
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("🔥 DAILY ROUTINE API ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
