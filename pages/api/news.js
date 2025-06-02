import fs from "fs";
import path from "path";
import axios from "axios";
import cheerio from "cheerio";
import { OpenAIClient } from "@azure/openai";
import { AzureKeyCredential } from "@azure/core-auth";

const NEWS_FILE_PATH = path.join(process.cwd(), "data", "news.json");
const API_URL = `https://gnews.io/api/v4/top-headlines?topic=health&lang=en&token=${process.env.GNEWS_API_KEY}`;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const azureClient = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
);
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

async function scrapeFullArticle(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const paragraphs = $("p")
      .slice(0, 6)
      .map((i, el) => $(el).text())
      .get()
      .join("\n\n");
    return paragraphs && paragraphs.trim().length > 0 ? paragraphs : null;
  } catch (error) {
    console.error("Scraping error for URL:", url, error.message);
    return null;
  }
}

async function fetchNewsFromAPI() {
  try {
    const response = await axios.get(API_URL);
    if (!response.data.articles || !Array.isArray(response.data.articles)) {
      throw new Error("Invalid API response format");
    }

    const articles = await Promise.all(
      response.data.articles.map(async (item, index) => {
        console.log("RAW ARTICLE:", item);
        if (!item.title) console.warn(`Missing title for article index ${index}`);

        let scrapedContent = await scrapeFullArticle(item.url);
        let generatedContent = null;

        if (!scrapedContent) {
          try {
            const messages = [
              {
                role: "system",
                content: "You are a professional journalist assistant.",
              },
              {
                role: "user",
                content: `Write a detailed and engaging news article using the following title and summary:\n\nTitle: ${item.title}\n\nSummary: ${item.description}`,
              },
            ];

            const chatResult = await azureClient.getChatCompletions(
              deploymentName,
              messages,
              {
                temperature: 0.7,
                maxTokens: 1000,
              }
            );
            generatedContent = chatResult.choices[0].message.content.trim();
          } catch (error) {
            console.error("Azure OpenAI generation error:", error.message);
          }
        }

        const fullContent =
          scrapedContent ||
          generatedContent ||
          `This article could not be fully loaded. Please visit the original source: ${item.url}`;

        return {
          id: index,
          slug:
            item.title
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)+/g, "") || `article-${index}`,
          title: item.title || `Article ${index}`,
          summary: item.description || "No summary available.",
          content: fullContent,
          link: item.url,
          image:
            item.image && item.image.trim().startsWith("http")
              ? item.image
              : "/images/defaultNews.jpg",
          publishedAt: item.publishedAt || null,
          isGenerated: !scrapedContent && !!generatedContent,
        };
      })
    );

    const newsData = {
      lastUpdated: Date.now(),
      articles,
    };

    fs.writeFileSync(NEWS_FILE_PATH, JSON.stringify(newsData, null, 2));
    return articles;
  } catch (error) {
    console.error("Error fetching news:", error.message);
    return [
      {
        id: 0,
        title: "Static Fallback Article",
        summary: "This is a static article used as fallback.",
        content:
          "This is static full content included when live scraping and AI generation fail.",
        link: "#",
        image: "/images/defaultNews.jpg",
        publishedAt: null,
        source: null,
        isGenerated: false,
      },
    ];
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const forceRefresh = req.query.refresh === "true";

      if (!forceRefresh && fs.existsSync(NEWS_FILE_PATH)) {
        const fileData = fs.readFileSync(NEWS_FILE_PATH, "utf8");
        const { lastUpdated, articles } = JSON.parse(fileData);
        const isCacheValid = Date.now() - lastUpdated < CACHE_DURATION;

        if (isCacheValid && articles.length > 0) {
          return res.status(200).json(articles);
        }
      }

      const newArticles = await fetchNewsFromAPI();
      return res.status(200).json(newArticles);
    } catch (error) {
      return res.status(500).json({ error: "Failed to process news data." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}