import fs from "fs";
import path from "path";

let cache = null;
let lastGenerated = null;

function getRandomSubset(array, count = 8) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function truncateWords(text, count) {
  return text.split(" ").slice(0, count).join(" ");
}

export default function handler(req, res) {
  const now = new Date();
  const isSameDay =
    lastGenerated && now.toDateString() === lastGenerated.toDateString();

  if (cache && isSameDay) {
    return res.status(200).json(cache);
  }

  const dataDir = path.join(process.cwd(), "data");
  const categories = ["fitness", "mindfulness", "nourish"];
  const result = {};
  const allTopics = [];

  try {
    for (const cat of categories) {
      const raw = fs.readFileSync(path.join(dataDir, `${cat}.json`), "utf-8");
      const json = JSON.parse(raw);
      const array = Array.isArray(json) ? json : json.featured;

      if (!Array.isArray(array)) {
        throw new Error(`${cat}.json does not contain a valid array`);
      }

      const topics = array.map((item) => ({
        href: `/${cat}/${item.id}`,
        text: item.shortTitle || truncateWords(item.title, 3),
      }));

      allTopics.push(...topics);

      result[cat] = {
        topics: [], // intentionally left empty since we're using mixedTopics
        spotlights: array.slice(0, 4).map((item) => ({
          img: item.image
            ? item.image.startsWith("/images/")
              ? item.image
              : `/images/${item.image}`
            : item.thumbnail
            ? item.thumbnail.startsWith("/images/")
              ? item.thumbnail
              : `/images/${item.thumbnail}`
            : "/icons/default.png",
          text: truncateWords(item.title, 3),
          href: `/${cat}/${item.id}`,
        })),
      };
    }

    result["mixedTopics"] = getRandomSubset(allTopics, 6);

    cache = result;
    lastGenerated = now;

    return res.status(200).json(result);
  } catch (err) {
    console.error("❌ navdata API error:", err);
    return res.status(500).json({ error: "Failed to load navigation data." });
  }
}
