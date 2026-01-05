import nodemailer from "nodemailer";

export async function sendEmail(email, subject, body, attachments = []) {
  const start = Date.now();

  // ✅ AUTO-DETECT TLS MODE BY PORT (FIXES LOCALHOST FAILURES)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: String(process.env.EMAIL_PORT) === "465",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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

      // ✅ Plain text fallback for spam filters
      text: body.replace(/<[^>]*>?/gm, ""),

      attachments,

      // -------------------------------------------------------
      // ✅ Enhanced Deliverability Headers (SAFE to add)
      // -------------------------------------------------------
      headers: {
        "X-Mailer": "Wellness Pure Life Mailer",
        "X-Priority": "3",
        "Auto-Submitted": "auto-generated",
        "X-Auto-Response-Suppress": "All",
        "List-Unsubscribe":
          `<https://wellnesspurelife.com/unsubscribe?email=${encodeURIComponent(
            email
          )}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    // -------------------------------------------------------
    // ✅ Advanced Structured Logging
    // -------------------------------------------------------
    console.log(
      "📨 EMAIL SENT:",
      JSON.stringify(
        {
          status: "success",
          to: email,
          subject,
          messageId: info.messageId,
          accepted: info.accepted,
          rejected: info.rejected,
          timeMs: Date.now() - start,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );

    return info;
  } catch (err) {
    console.error(
      "❌ EMAIL ERROR:",
      JSON.stringify(
        {
          status: "error",
          to: email,
          subject,
          error: err.message,
          stack: err.stack,
          timeMs: Date.now() - start,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );

    throw err;
  }
}
