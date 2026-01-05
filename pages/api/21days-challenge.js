import { MongoClient } from "mongodb";
import { sendEmail } from "../../utils/email";

import {
  create21DaysMindfulnessChallengeEmail,
  create21DaysFitnessChallengeEmail,
  create21DaysNourishChallengeEmail,
  createMindfulnessCompletionEmail,
  createFitnessCompletionEmail,
  createNourishCompletionEmail,
} from "../../emails/emailCreator";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// ------------------------------
// CERTIFICATE GENERATOR
// ------------------------------
async function generateCertificate(name, type = "mindfulness") {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const titles = {
    mindfulness: "21 Days of Mindfulness Challenge",
    fitness: "21 Days of Fitness Challenge",
    nourish: "21 Days of Nourish Challenge",
  };

  page.drawText("🏆 Certificate of Completion", {
    x: 150,
    y: 320,
    size: 22,
    font,
    color: rgb(0.2, 0.2, 0.6),
  });

  page.drawText(name || "Participant", {
    x: 200,
    y: 260,
    size: 18,
    font,
  });

  page.drawText(`has completed the ${titles[type]}`, {
    x: 80,
    y: 220,
    size: 14,
    font,
  });

  page.drawText("Wellness Pure Life", {
    x: 230,
    y: 100,
    size: 12,
    font,
    color: rgb(0.3, 0.5, 0.3),
  });

  return Buffer.from(await pdfDoc.save());
}

// ------------------------------
// CHALLENGE CONFIG MAP
// ------------------------------
const CHALLENGE_CONFIG = {
  mindfulness: {
    userKey: "challenge_21_mindfulness",
    collection: "challenges_21_mindfulness",
    createEmail: create21DaysMindfulnessChallengeEmail,
    createCompletion: createMindfulnessCompletionEmail,
  },
  fitness: {
    userKey: "challenge_21_fitness",
    collection: "challenges_21_fitness",
    createEmail: create21DaysFitnessChallengeEmail,
    createCompletion: createFitnessCompletionEmail,
  },
  nourish: {
    userKey: "challenge_21_nourish",
    collection: "challenges_21_nourish",
    createEmail: create21DaysNourishChallengeEmail,
    createCompletion: createNourishCompletionEmail,
  },
};

export default async function handler(req, res) {
  if (!["POST", "GET"].includes(req.method)) {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // ----------------------------------------------------
    // POST — User manually requests the day's email
    // ----------------------------------------------------
    if (req.method === "POST") {
      const { type = "mindfulness", email, name, dayNumber } = req.body;

      if (!email || !dayNumber || !type) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const cfg = CHALLENGE_CONFIG[type];

      const challenge = await db
        .collection(cfg.collection)
        .findOne({ day: parseInt(dayNumber, 10) });

      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }

      // Day 21 → certificate
      if (parseInt(dayNumber, 10) === 21) {
        const { subject, body } = cfg.createCompletion(name);
        const pdfBuf = await generateCertificate(name, type);

        await sendEmail(email, subject, body, [
          { filename: "certificate.pdf", content: pdfBuf },
        ]);
      } else {
        // Standard day challenge email
        const { subject, body } = cfg.createEmail(name, dayNumber, challenge);
        await sendEmail(email, subject, body);
      }

      // Update user progress (max = avoids backward reset)
      await db.collection("users").updateOne(
        { email },
        { $max: { [`${cfg.userKey}.lastEmailSentDay`]: dayNumber } }
      );

      return res.status(200).json({ message: "Email sent." });
    }

    // ----------------------------------------------------
    // GET — Cron daily automatic sending
    // ----------------------------------------------------
    const today = new Date();
    let totalSent = 0;

    for (const type of Object.keys(CHALLENGE_CONFIG)) {
      const cfg = CHALLENGE_CONFIG[type];

      const users = await db
        .collection("users")
        .find({ [`${cfg.userKey}.startedAt`]: { $exists: true } })
        .toArray();

      for (const user of users) {
        const ch = user[cfg.userKey];
        if (!ch?.startedAt) continue;

        const start = new Date(ch.startedAt);
        const daysSince = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        const dayNumber = daysSince + 1;

        if (dayNumber < 1 || dayNumber > 21) continue;
        if (ch.lastEmailSentDay >= dayNumber) continue;

        const challenge = await db
          .collection(cfg.collection)
          .findOne({ day: dayNumber });

        if (!challenge) continue;

        // Day 21 → certificate
        if (dayNumber === 21) {
          const { subject, body } = cfg.createCompletion(user.name);
          const pdfBuf = await generateCertificate(user.name, type);

          await sendEmail(user.email, subject, body, [
            { filename: "certificate.pdf", content: pdfBuf },
          ]);
        } else {
          const { subject, body } = cfg.createEmail(
            user.name,
            dayNumber,
            challenge
          );
          await sendEmail(user.email, subject, body);
        }

        await db.collection("users").updateOne(
          { email: user.email },
          { $set: { [`${cfg.userKey}.lastEmailSentDay`]: dayNumber } }
        );

        totalSent++;
      }
    }

    return res.status(200).json({
      message: `Cron completed. Total emails sent: ${totalSent}`,
    });
  } catch (error) {
    console.error("❌ 21days-challenge API error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      detail: error.message,
    });
  } finally {
    if (client) await client.close();
  }
}
