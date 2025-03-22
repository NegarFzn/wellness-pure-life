import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import classes from "./LatestArticles.module.css"; // Import CSS

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

      setArticles(allArticles.slice(0, 4));
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
            <Link href={`/${article.category}/${article.id}`}>Read More</Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestArticles;
