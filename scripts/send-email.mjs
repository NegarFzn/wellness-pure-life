// ONE SIMPLE FILE TO SEND TEST EMAIL

import nodemailer from "nodemailer";
import dotenv from "dotenv";

// load .env
dotenv.config();

async function main() {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const receiver = process.env.RECEIVER_EMAIL;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: true, // because 465
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from: user,
    to: receiver,
    subject: "SMTP TEST EMAIL",
    text: "This is a test email sent from one simple file.",
  });

  console.log("Email sent:", info.messageId);
}

main().catch(console.error);

