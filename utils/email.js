import nodemailer from "nodemailer";

function htmlToText(html = "") {
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function sendEmail(email, subject, body, attachments = []) {
  const start = Date.now();

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // mail.robotscapital.com
    port: 587,
    secure: false, // ❗ MUST be false for 587

    // ✅ Force STARTTLS upgrade (matches your Postfix config)
    requireTLS: true,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    // ✅ Critical for your setup (HELO must match server)
    name: "mail.robotscapital.com",

    tls: {
      servername: process.env.EMAIL_HOST,
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
    },

    logger: true,
    debug: true,
  });

  try {
    const info = await transporter.sendMail({
      from: `"Wellness Pure Life" <${process.env.EMAIL_USER}>`,
      replyTo: "support@wellnesspurelife.com",
      to: email,
      subject,
      html: body,
      text: htmlToText(body),
      attachments,

      headers: {
        "X-Mailer": "Wellness Pure Life Mailer",
        "Auto-Submitted": "auto-generated",
        "X-Auto-Response-Suppress": "All",
        "List-Unsubscribe":
          `<https://wellnesspurelife.com/unsubscribe?email=${encodeURIComponent(email)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    console.log("📨 EMAIL SENT:", {
      to: email,
      subject,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
      timeMs: Date.now() - start,
    });

    return info;
  } catch (err) {
    console.error("❌ EMAIL ERROR:", {
      to: email,
      subject,
      error: err.message,
      code: err.code,
      command: err.command,
      response: err.response,
      rejected: err.rejected,
      timeMs: Date.now() - start,
    });

    throw err;
  }
}