import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchNews } from "../../utils/fetch";
import classes from "./index.module.css";

export default function NewsDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);

  useEffect(() => {
    async function getArticle() {
      try {
        const articles = await fetchNews();
        const found = articles.find((item) => item.id.toString() === id);
        setArticle(found || null);
      } catch (err) {
        console.error("Failed to load article:", err);
        setArticle(null);
      }
    }

    if (id) getArticle();
  }, [id]);

  if (!article) return <p>Loading article...</p>;

  return (
    <div className={classes.newsPage}>
      <h1>{article.title}</h1>
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className={classes.newsImage}
        />
      )}
      <p className={classes.newsSummary}>{article.summary}</p>
      <div className={classes.newsContent}>
        {article.content ? (
          article.content
            .split("\n\n")
            .map((para, idx) => <p key={idx}>{para}</p>)
        ) : (
          <em>No full content available.</em>
        )}
      </div>
    </div>
  );
}
