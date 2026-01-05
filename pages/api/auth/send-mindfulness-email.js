import { MongoClient } from "mongodb";
import { sendEmail } from "../../../utils/email";
import {
  create21DaysMindfulnessChallengeEmail,
  createChallengeCompletionEmail,
} from "../../../emails/emailCreator";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

async function generateCertificate(name = "Participant") {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText("🏆 Certificate of Completion", {
    x: 150,
    y: 320,
    size: 22,
    font,
    color: rgb(0.2, 0.2, 0.6),
  });

  page.drawText(name, {
    x: 200,
    y: 260,
    size: 18,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText("has completed the 21 Days of Mindfulness Challenge", {
    x: 90,
    y: 220,
    size: 14,
    font,
  });

  page.drawText("Wellness Pure Life", {
    x: 220,
    y: 100,
    size: 12,
    font,
    color: rgb(0.3, 0.5, 0.3),
  });

  return Buffer.from(await pdfDoc.save());
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // ---------------------------------------------------
    // POST = Manual user-triggered sending (ALWAYS ALLOW)
    // ---------------------------------------------------
    if (req.method === "POST") {
      const { email, name, dayNumber } = req.body || {};

      if (!email || !dayNumber) {
        return res.status(400).json({ error: "Missing email or dayNumber" });
      }

      const challenge = await db
        .collection("challenges_21_mindfulness")
        .findOne({ day: parseInt(dayNumber, 10) });

      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }

      // If Day 21 → send certificate PDF
      if (parseInt(dayNumber, 10) === 21) {
        const { subject, body } = createChallengeCompletionEmail(name);
        const pdfBuf = await generateCertificate(name || "Participant");

        await sendEmail(email, subject, body, [
          {
            filename: "certificate.pdf",
            content: pdfBuf,
            contentType: "application/pdf",
          },
        ]);
      } else {
        // Otherwise send challenge content
        const { subject, body } = create21DaysMindfulnessChallengeEmail(
          name || "there",
          dayNumber,
          challenge
        );

        await sendEmail(email, subject, body);
      }

      // UPDATE LAST SENT DAY ONLY IF dayNumber > lastEmailSentDay
      await db.collection("users").updateOne(
        { email },
        {
          $max: { "challenge_21_mindfulness.lastEmailSentDay": dayNumber },
        }
      );

      return res.status(200).json({ message: "Email sent." });
    }

    // ---------------------------------------------------
    // GET = Cron job (send once per day only)
    // ---------------------------------------------------
    const users = await db
      .collection("users")
      .find({ "challenge_21_mindfulness.startedAt": { $exists: true } })
      .toArray();

    const today = new Date();
    let totalSent = 0;

    for (const user of users) {
      const { startedAt, lastEmailSentDay = 0 } =
        user.challenge_21_mindfulness || {};

      if (!startedAt) continue;

      const start = new Date(startedAt);

      const daysSinceStart = Math.floor(
        (today - start) / (1000 * 60 * 60 * 24)
      );

      const dayNumber = daysSinceStart + 1;

      if (dayNumber < 1 || dayNumber > 21) continue;

      // Cron should NOT send duplicates
      if (lastEmailSentDay >= dayNumber) continue;

      const challenge = await db
        .collection("challenges_21_mindfulness")
        .findOne({ day: dayNumber });

      if (!challenge) continue;

      // Day 21 → send certificate
      if (parseInt(dayNumber, 10) === 21) {
        const { subject, body } = createChallengeCompletionEmail(user.name);
        const pdfBuf = await generateCertificate(user.name || "Participant");

        await sendEmail(user.email, subject, body, [
          {
            filename: "certificate.pdf",
            content: pdfBuf,
            contentType: "application/pdf",
          },
        ]);
      } else {
        // Otherwise send challenge day
        const { subject, body } = create21DaysMindfulnessChallengeEmail(
          user.name || "there",
          dayNumber,
          challenge
        );

        await sendEmail(user.email, subject, body);
      }

      // Update lastEmailSentDay
      await db.collection("users").updateOne(
        { email: user.email },
        { $set: { "challenge_21_mindfulness.lastEmailSentDay": dayNumber } }
      );

      totalSent++;
    }

    return res.status(200).json({
      message: `Cron completed. Emails sent: ${totalSent}`,
    });
  } catch (error) {
    console.error("❌ send-mindfulness-email failed:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      detail: error.message,
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
