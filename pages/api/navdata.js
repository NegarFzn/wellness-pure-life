import fs from "fs";
import path from "path";

let cache = null;
let lastGenerated = null;

function getRandomSubset(array, count = 8) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function extractNavData(array, category) {
    const topics = array.map(item => ({
      href: `/${category}/${item.id}`,
      text: item.shortTitle || item.title,
    }));
  
    const spotlights = array.slice(0, 2).map((item, index) => ({
      img: `/icons/${category}${index + 1}.png`,
      text: item.title,
      href: `/${category}/${item.id}`, // <-- this line adds the link
    }));
  
    return {
      topics: getRandomSubset(topics, 6),
      spotlights,
    };
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

  try {
    for (const cat of categories) {
      const raw = fs.readFileSync(path.join(dataDir, `${cat}.json`), "utf-8");
      const json = JSON.parse(raw);

      // Support nested 'featured' key
      const array = Array.isArray(json) ? json : json.featured;

      if (!Array.isArray(array)) {
        throw new Error(`${cat}.json does not contain a valid array`);
      }

      result[cat] = extractNavData(array, cat);
    }

    cache = result;
    lastGenerated = now;

    console.log("✅ navdata result:", JSON.stringify(result, null, 2));
    return res.status(200).json(result);
  } catch (err) {
    console.error("❌ navdata API error:", err);
    return res.status(500).json({ error: "Failed to load navigation data." });
  }
}
