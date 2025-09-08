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

export function createContactEmail(name, email, message) {
  const subject = "New Contact Form Message";
  const bodyContent = `
    <h2>New message from ${name}</h2>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;
  return { subject, body: emailTemplate(bodyContent) };
}

export function createWeeklySummaryEmail(name, result) {
  const subject = `🗓️ Your Weekly Wellness Summary: ${result}`;

  const bodyContent = `
    <h2>🌿 Hi ${name || "there"},</h2>
    <p>This week you're trending as <strong>${result}</strong>.</p>
    <p>Here are some tailored suggestions:</p>
    <ul>
      <li>🧘 <a href="https://wellnesspurelife.com/mindfulness">Meditation Practices</a></li>
      <li>🥗 <a href="https://wellnesspurelife.com/nourish">Healthy Meal Plans</a></li>
      <li>🏋️‍♀️ <a href="https://wellnesspurelife.com/fitness">Custom Fitness Routines</a></li>
    </ul>
    <p>Stay well and consistent 💚</p>
  `;

  return { subject, body: emailTemplate(bodyContent) };
}

export function createQuizResultEmail(
  email,
  result,
  answers,
  quiz,
  recommendations = []
) {
  const recList = recommendations
    .map((r) => `<li><strong>${r.title}:</strong> ${r.description}</li>`)
    .join("");

  const bodyContent = `
    <h2>Your result: ${result}</h2>
    <p>Here are your answers:</p>
    <ul>${Object.entries(answers)
      .map(([q, a]) => `<li>${q}: ${a}</li>`)
      .join("")}</ul>
    <h3>Our Recommendations:</h3>
    <ul>${recList}</ul>
  `;

  return {
    subject: `Your Wellness Quiz Result: ${result}`,
    body: emailTemplate(bodyContent),
  };
}

export function createFitnessEmail(answers) {
  // Format logic (already done)
  return {
    subject: "Your Fitness Plan",
    body: emailTemplate(/* formatted fitness HTML */),
  };
}

export function createMindfulnessEmail(answers) {
  return {
    subject: "Your Mindfulness Plan",
    body: emailTemplate(`
      <h2>🧘‍♀️ Mindfulness Plan</h2>
      <p>Here are some personalized suggestions to reduce stress and stay focused:</p>
      <ul>
        ${(answers.activities || []).map((a) => `<li>${a}</li>`).join("")}
      </ul>
    `),
  };
}

export function createNourishEmail(answers) {
  return {
    subject: "Your Personalized Nutrition Plan",
    body: emailTemplate(`
      <h2>🥗 Nutrition Plan</h2>
      <p>Based on your preferences, here's what suits your goals:</p>
      <ul>
        <li><strong>Diet Type:</strong> ${answers.dietType}</li>
        <li><strong>Meals/Day:</strong> ${answers.mealsPerDay}</li>
        <li><strong>Allergies:</strong> ${
          answers.allergies?.join(", ") || "None"
        }</li>
      </ul>
    `),
  };
}
