const fs = require("fs");

const fitness = JSON.parse(fs.readFileSync("./fitness.json", "utf-8"));
const mindfulness = JSON.parse(fs.readFileSync("./mindfulness.json", "utf-8"));
const nourish = JSON.parse(fs.readFileSync("./nourish.json", "utf-8"));

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
      <h2>Your Health Highlights</h2>
      <p><strong>Fitness:</strong> ${fit.title} – <a href="https://wellnesspurelife.com/fitness/${fit.id}">Read more</a></p>
      <p><strong>Mindfulness:</strong> ${mind.title} – <a href="https://wellnesspurelife.com/mindfulness/${mind.id}">Explore</a></p>
      <p><strong>Nutrition:</strong> ${food.title} – <a href="https://wellnesspurelife.com/nourish/${food.id}">Learn more</a></p>
    `,
  };
}

module.exports = { generateEmailContent };
