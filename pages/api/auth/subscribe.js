import { connectToDatabase } from "../../../utils/mongodb";
import { generateFunnel7DayContent } from "../../../emails/contentGenerator";
import { sendEmail } from "../../../utils/email"; // <-- REQUIRED

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, name, source, quizType } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const { db } = await connectToDatabase();
    const users = db.collection("users");

    // ============================================================
    // 1) GENERATE DAY 0 CONTENT
    // ============================================================
    const funnelContent = generateFunnel7DayContent(0, name || "there");

    // ============================================================
    // 2) SEND THE EMAIL NOW (CRITICAL)
    // ============================================================
    await sendEmail(email, funnelContent.subject, funnelContent.htmlContent);

    // ============================================================
    // 3) CHECK IF USER EXISTS
    // ============================================================
    const existing = await users.findOne({ email });

    if (existing) {
      // Already in active funnel → DO NOT restart
      if (existing?.funnel_7day?.status === "active") {
        return res.status(200).json({
          success: true,
          message: "User already in active funnel.",
        });
      }

      // Restart funnel
      await users.updateOne(
        { email },
        {
          $set: {
            name: name || existing.name || null,
            "funnel_7day.status": "active",
            "funnel_7day.day": 0,
            "funnel_7day.lastSentAt": new Date(),
            "funnel_7day.source": source || "static",
            "funnel_7day.quizType": quizType || null,
            "funnel_7day.generatedContent": funnelContent,
          },
        }
      );

      return res.status(200).json({
        success: true,
        message: "Funnel restarted for existing user.",
      });
    }

    // ============================================================
    // 4) CREATE NEW USER + INIT FUNNEL
    // ============================================================
    await users.insertOne({
      email,
      name: name || null,
      createdAt: new Date(),
      isPremium: false,

      funnel_7day: {
        day: 0,
        lastSentAt: new Date(),
        status: "active",
        source: source || "static",
        quizType: quizType || null,
        generatedContent: funnelContent,
      },

      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      consentAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "User added to 7-day funnel and email sent.",
    });
  } catch (err) {
    console.error("SUBSCRIBE API ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
