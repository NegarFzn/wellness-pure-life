import { useState, useEffect } from "react";
import { fetchNews } from "../../utils/fetch"; // ✅ Import fetch function
import classes from "./news.module.css";

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
    <div className={classes.newsPage}>
      <h1 className={classes.newsHeader}>Latest Health & Wellness News</h1>

      {loading ? (
        <p>Loading news...</p>
      ) : articles.length > 0 ? (
        <ul className={classes.newsList}>
          {articles.map((article) => (
            <li key={article.id} className={classes.newsItem}>
              <img
                src={article.image}
                alt={article.title}
                className={classes.newsImage}
              />
              <h2>{article.title}</h2>
              <p>{article.summary}</p>
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
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
  );
}
