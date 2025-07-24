import fs from "fs";
import path from "path";

const __dirname = path.resolve();

// Read and parse JSON files
const newsData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "data/news.json"), "utf-8")
);
const fitness = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "data/fitness.json"), "utf-8")
);
const mindfulness = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "data/mindfulness.json"), "utf-8")
);
const nourish = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "data/nourish.json"), "utf-8")
);

function pickRandomEntry(data) {
  const sections = Object.values(data).flat();
  return sections[Math.floor(Math.random() * sections.length)];
}

export function generateEmailContent() {
  const fit = pickRandomEntry(fitness);
  const mind = pickRandomEntry(mindfulness);
  const food = pickRandomEntry(nourish);
  const news = pickRandomEntry(newsData);

  return {
    subject: "This Week’s Wellness: Fuel, Focus & Fitness 💚",
    body: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #2c2c2c; font-size: 17px; line-height: 1.75; padding: 24px; max-width: 600px; background-color: #fff; border-radius: 8px;">
        <h2 style="color: #0d0d0d; font-size: 26px; margin-bottom: 20px;">🌟 Your Health Highlights</h2>

        <div style="margin-bottom: 24px;">
          <p style="margin: 12px 0;">
            <strong style="font-size: 18px; color: #000;">Fitness:</strong>
            ${fit.title}
            <a href="https://wellnesspurelife.com/fitness/${fit.id}" style="color: #1a73e8; text-decoration: none; margin-left: 8px;">→ Read more</a>
          </p>
          <p style="margin: 12px 0;">
            <strong style="font-size: 18px; color: #000;">Mindfulness:</strong>
            ${mind.title}
            <a href="https://wellnesspurelife.com/mindfulness/${mind.id}" style="color: #1a73e8; text-decoration: none; margin-left: 8px;">→ Explore</a>
          </p>
          <p style="margin: 12px 0;">
            <strong style="font-size: 18px; color: #000;">Nutrition:</strong>
            ${food.title}
            <a href="https://wellnesspurelife.com/nourish/${food.id}" style="color: #1a73e8; text-decoration: none; margin-left: 8px;">→ Learn more</a>
          </p>
          <p style="margin: 12px 0;">
            <strong style="font-size: 18px; color: #000;">News:</strong>
            ${news.title}
            <a href="${news.link}" style="color: #1a73e8; text-decoration: none; margin-left: 8px;">→ Read more</a>
          </p>
        </div>

        <p style="margin-top: 32px; font-size: 16px; color: #555;">
          Stay well,<br/>
          <strong style="color: #1e88e5;">The Wellness Pure Life Team 🌿</strong>
        </p>
      </div>
    `,
  };
}


