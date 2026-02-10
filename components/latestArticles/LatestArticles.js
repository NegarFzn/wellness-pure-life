import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { gaEvent } from "../../lib/gtag"; // <-- ADD THIS
import classes from "./LatestArticles.module.css";

const LatestArticles = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const fitnessRes = await fetch("/data/fitness.json");
      const mindfulnessRes = await fetch("/data/mindfulness.json");
      const nourishRes = await fetch("/data/nourish.json");

      const fitnessData = await fitnessRes.json();
      const mindfulnessData = await mindfulnessRes.json();
      const nourishData = await nourishRes.json();

      const allArticles = [
        ...fitnessData,
        ...mindfulnessData,
        ...nourishData,
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      const latest = allArticles.slice(0, 4);
      setArticles(latest);

      // -----------------------------
      // GA4 ANALYTICS: LIST VIEW
      // -----------------------------
      gaEvent("latest_articles_view", {
        total_articles: latest.length,
        categories: ["fitness", "mindfulness", "nourish"],
      });

      // -----------------------------
      // GA4 ANOMALY KEY EVENT
      // -----------------------------
      gaEvent("key_latest_articles_loaded", {
        count: latest.length,
      });
    };

    fetchArticles();
  }, []);

  return (
    <section className={classes.latestArticles}>
      <h2>Latest Articles</h2>
      <div className={classes.articlesGrid}>
        {articles.map((article) => (
          <div key={article.id} className={classes.articleCard}>
            <Image
              src={`/images/${article.image}`}
              alt={article.title}
              width={250}
              height={160}
            />

            <h3>{article.title}</h3>
            <p>{article.summary}</p>

            <Link
              href={`/${article.category}/${article.id}`}
              onClick={() => {
                // GA4 card click
                gaEvent("latest_articles_click", {
                  id: article.id,
                  category: article.category,
                });

                // Anomaly key click
                gaEvent("key_latest_article_clicked", {
                  id: article.id,
                });
              }}
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestArticles;
