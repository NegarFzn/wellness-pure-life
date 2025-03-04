import fs from "fs";
import path from "path";

const NEWS_FILE_PATH = path.join(process.cwd(), "data", "news.json");
const API_URL = `https://gnews.io/api/v4/top-headlines?topic=health&lang=en&token=${process.env.GNEWS_API_KEY}`;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

async function fetchNewsFromAPI() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch news from GNews API");
    }

    const data = await response.json();
    const articles = data.articles.map((item, index) => ({
      id: index,
      title: item.title,
      summary: item.description,
      link: item.url,
      image: item.image && item.image.trim().startsWith("http") 
      ? item.image 
      : "/images/defaultNews.jpg",
    }));

    const newsData = {
      lastUpdated: Date.now(),
      articles,
    };

    // Store data
    fs.writeFileSync(NEWS_FILE_PATH, JSON.stringify(articles, null, 2));

    return articles;
  } catch (error) {
    console.error("Error fetching news:", error.message);
    return [];
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Check if the file exists and has valid JSON data
      if (fs.existsSync(NEWS_FILE_PATH)) {
        const fileData = fs.readFileSync(NEWS_FILE_PATH, "utf8");
        const { lastUpdated, articles } = JSON.parse(fileData);

        const isCacheValid = Date.now() - lastUpdated < CACHE_DURATION;

        if (isCacheValid && articles.length > 0) {
          return res.status(200).json(articles);
        }
      }

      // Fetch new news if the file is missing or empty
      const newArticles = await fetchNewsFromAPI();

      if (newArticles.length === 0) {
        return res.status(404).json({ error: "No news data available." });
      }

      return res.status(200).json(newArticles);
    } catch (error) {
      return res.status(500).json({ error: "Failed to process news data." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
