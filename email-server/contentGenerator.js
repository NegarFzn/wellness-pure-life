const fs = require("fs");
const path = require("path");
import newsData from "../data/news.json";

const fitness = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "fitness.json"), "utf-8")
);
const mindfulness = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "mindfulness.json"), "utf-8")
);
const nourish = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "nourish.json"), "utf-8")
);
const news = pickRandomEntry(newsData);

function pickRandomEntry(data) {
  const sections = Object.values(data).flat();
  return sections[Math.floor(Math.random() * sections.length)];
}

function generateEmailContent() {
  const fit = pickRandomEntry(fitness);
  const mind = pickRandomEntry(mindfulness);
  const food = pickRandomEntry(nourish);

  return {
    subject: "This Week’s Wellness: Fuel, Focus & Fitness 💚",
    body: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; font-size: 18px; line-height: 1.7; padding: 20px;">
    <h2 style="color: #111; font-size: 24px; margin-top: 10px;">Your Health Highlights</h2>
    <div style="margin: 24px 0;">
      <p style="margin: 8px 0;">
        <strong font-size: 19px;"><span style="color: #000;">Fitness:</span></strong><br/>
        ${fit.title} <a href="https://wellnesspurelife.com/fitness/${fit.id}" style="color: #1a73e8; text-decoration: none;">→ Read more</a>
      </p>
      <p style="margin: 8px 0;">
        <strong font-size: 19px;"><span style="color: #000;">Mindfulness:</span></strong><br/>
        ${mind.title} <a href="https://wellnesspurelife.com/mindfulness/${mind.id}" style="color: #1a73e8; text-decoration: none;">→ Explore</a>
      </p>
      <p style="margin: 8px 0;">
        <strong font-size: 19px;"><span style="color: #000;">Nutrition:</span></strong><br/>
        ${food.title} <a href="https://wellnesspurelife.com/nourish/${food.id}" style="color: #1a73e8; text-decoration: none;">→ Learn more</a>
      </p>
      <p style="margin: 8px 0;">
        <strong font-size: 19px;"><span style="color: #000;">News:</span></strong><br/>
        ${news.title} <a href="${news.link}" style="color: #1a73e8; text-decoration: none;">→ Read more</a>
      </p>
    </div>
    <p style="margin-top: 32px; font-size: 16px; color: #666;">
      Stay well,<br/>
      <strong style="color: #1e88e5;">The Wellness Pure Life Team 🌿</strong>
    </p>
  </div>
    `,
  };
}

module.exports = { generateEmailContent };
