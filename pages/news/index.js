import { useState, useEffect } from "react";
import { fetchNews } from "../../utils/fetch";
import Link from "next/link";
import AdSidebar from "../../components/Ads/AdSidebar";
import AdBlock from "../../components/Ads/AdBlock";
import classes from "./index.module.css";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getNews() {
      const newsData = await fetchNews();
      setArticles(newsData);
      setLoading(false);
    }

    getNews();
  }, []);

  return (
    <div className={classes.pageWrapper}>
      <AdBlock
        adSlot="1234567890"
        className={`${classes.adBlock} ${classes.adTop}`}
      />
      {/* LEFT: News Content */}
      <div className={classes.newsPage}>
        <h1 className={classes.newsHeader}>Latest Health & Wellness News</h1>
        {loading ? (
          <p>Loading news...</p>
        ) : articles.length > 0 ? (
          <ul className={classes.newsList}>
            {articles.map((article) => (
              <li key={article.id} className={classes.newsItem}>
                <img
                  src={article.image || "/images/defaultNews.jpg"}
                  alt={article.title}
                  className={classes.newsImage}
                  onError={(e) => {
                    e.target.src = "/images/defaultNews.jpg";
                  }}
                />
                <h2>{article.title}</h2>
                <p>{article.summary}</p>
                <Link
                  href={`/news/${article.slug}`}
                  className={classes.readMore}
                >
                  Read more
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className={classes.noNews}>
            <img
              src="/no-news.svg"
              alt="No news"
              className={classes.noNewsImage}
            />
            <h2>No News Available</h2>
            <p>Please check back later.</p>
          </div>
        )}
      </div>

      {/* RIGHT: Google Ad */}
      <AdSidebar adSlots={["1234567890", "2345678901", "3456789012"]} />
      <AdBlock
        adSlot="2345678901"
        className={`${classes.adBlock} ${classes.adBottom}`}
      />
    </div>
  );
}
