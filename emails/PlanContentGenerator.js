import { emailTemplate } from "./emailTemplate";

export function generateEmailPlanContent({ answers, category, matchedPlan }) {
  const normalizedCategory = category.toLowerCase().replace("-plan", "");

  const titleMap = {
    fitness: "💪 Your Personalized Fitness Plan",
    mindfulness: "🧠 Your Personalized Mindfulness Plan",
    nourish: "🍎 Your Personalized Nutrition Plan",
  };

  const subject =
    titleMap[normalizedCategory] || "🌿 Your Personalized Wellness Plan";

  const summary =
    matchedPlan?.summary ||
    "Here's your custom wellness plan based on your preferences.";

  const structure = Array.isArray(matchedPlan?.structure)
    ? matchedPlan.structure
    : [];

  const planStructureHTML = structure.length
    ? `<ul style="margin: 16px 0; padding-left: 20px; color: #374151; font-size: 15px; line-height: 1.6;">
        ${structure
          .map((item) => `<li style="margin-bottom: 8px;">✔️ ${item}</li>`)
          .join("")}
      </ul>`
    : `<p style="font-size: 15px; color: #6b7280;">No detailed plan structure available.</p>`;

  const formattedChallenges = Array.isArray(answers?.challenges)
    ? answers.challenges.join(", ")
    : answers?.challenges || "";

  const content = `
    <div style="font-family: 'Segoe UI', Tahoma, sans-serif; color: #111827; line-height: 1.6; padding: 0 8px;">
      <h2 style="font-size: 24px; color: #1f2937; font-weight: bold; margin-top: 0; margin-bottom: 16px;">
        ${titleMap[normalizedCategory] || "Your Personalized Wellness Plan"}
      </h2>

      <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">
        ${summary}
      </p>

      ${planStructureHTML}

      ${
        formattedChallenges
          ? `<div style="margin-top: 24px;">
              <p style="font-size: 15px; color: #374151;">
                <strong style="color: #111827;">Your Challenges:</strong> ${formattedChallenges}
              </p>
            </div>`
          : ""
      }

      <div style="margin-top: 32px; padding: 16px; background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 6px;">
        <p style="font-size: 15px; color: #065f46; margin: 0;">
          🌱 Stay consistent and make progress at your own pace. We're here to support your journey every step of the way.
        </p>
      </div>
    </div>
  `;

  return {
    subject,
    body: emailTemplate(content),
  };
}
