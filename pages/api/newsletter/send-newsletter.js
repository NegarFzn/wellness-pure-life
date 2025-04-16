import { db } from "../../../lib/firebaseAdmin";
import nodemailer from "nodemailer";
import { generateEmailContent } from "@/email-server/generateEmailContent";
import { emailTemplate } from "@/email-server/emailTemplate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const snapshot = await db.collection("subscribers").get(); // ✅ admin-style

    if (snapshot.empty) {
      return res
        .status(200)
        .json({ success: false, message: "📭 No subscribers found." });
    }

    const { subject, body } = generateEmailContent();

    const transporter = nodemailer.createTransport({
      host: "mail.robotscapital.com",
      port: 465,
      secure: true,
      auth: {
        user: "info@wellnesspurelife.com",
        pass: "mK3CmVABnzWmWk",
      },
    });

    const sendPromises = snapshot.docs.map((doc) => {
      const { name, email } = doc.data();
      const html = emailTemplate(name, body);

      return transporter.sendMail({
        from: '"Wellness Pure Life" <info@wellnesspurelife.com>',
        to: email,
        subject,
        html,
      });
    });

    await Promise.all(sendPromises);

    return res
      .status(200)
      .json({ success: true, message: "✅ Weekly newsletters sent!" });
  } catch (err) {
    console.error("❌ Newsletter Error:", err);
    return res.status(500).json({ message: "Failed to send newsletters." });
  }
}
