import { emailTemplate } from "./emailTemplate";

export function createWelcomeEmail(name) {
  const subject = "Welcome to Wellness Pure Life";
  const bodyContent = `
    <h2>Hi ${name},</h2>
    <p>Thanks for joining us! We're excited to have you on your wellness journey.</p>
  `;
  return { subject, body: emailTemplate(bodyContent) };
}

export function createVerificationEmail(name, token) {
  const subject = "Verify your Wellness Pure Life account";

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://wellnesspurelife.com";

  const verificationLink = `${baseUrl}/?verifyToken=${token}`;

  const bodyContent = `
    <h2>Hi ${name},</h2>
    <p>You're almost there!</p>
    <p>Please verify your email to unlock personalized health insights and full access to your Wellness Pure Life experience.</p>
    <p>👉 <a href="${verificationLink}">Click here to verify your email</a></p>
  `;

  return { subject, body: emailTemplate(bodyContent) };
}

export function createSubscriptionEmail(name) {
  const subject = "Thank you for subscribing to Wellness Pure Life";
  const bodyContent = `
    <h2>Hi ${name},</h2>
    <p>Thank you for subscribing! You'll now receive personalized insights, tips, and updates straight to your inbox.</p>
    <p>We’re here to support your health, fitness, and mental well-being journey every step of the way.</p>
    <p style="color: gray; font-size: 0.9rem;">You’re receiving this email because you subscribed to Wellness Pure Life.</p>
  `;
  return { subject, body: emailTemplate(bodyContent) };
}

export function createPasswordResetEmail(name, token) {
  const subject = "Reset Your Password - Wellness Pure Life";

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://wellnesspurelife.com";

  const resetLink = `${baseUrl}/?resetToken=${token}`;

  const bodyContent = `
    <h2>Hi ${name || "there"},</h2>
    <p>We received a request to reset your password.</p>
    <p>👉 <a href="${resetLink}">Click here to reset your password</a></p>
    <p>This link is valid for 15 minutes.</p>
    <p>If you didn’t request this, you can ignore this email.</p>
  `;

  return { subject, body: emailTemplate(bodyContent) };
}
