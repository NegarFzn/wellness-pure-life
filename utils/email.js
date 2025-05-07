import nodemailer from "nodemailer";

export async function sendEmail(email, subject, body) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter.sendMail({
    from: '"Wellness Pure Life" <info@wellnesspurelife.com>',
    to: email,
    subject,
    html: body,
  });
}
