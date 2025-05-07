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
  const verificationLink = `https://wellnesspurelife.com/verify?token=${token}`;
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
