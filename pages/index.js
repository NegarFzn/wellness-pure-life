import { useState, useEffect } from "react";
import { fetchNews } from "../utils/fetch";
import Head from "next/head";
import Subscribe from "../components/Subscribe/subscribe";
import KeyFeatures from "../components/KeyFeatures/KeyFeatures";
import DailyList from "../components/DailyList/DailyList";
import classes from "./index.module.css"; 

export default function Home() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const getNews = async () => {
      const news = await fetchNews();
      setNewsArticles(news.slice(0, 2));
    };

    getNews();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Head>
        <title>Healthy Living - Mind & Body Wellness</title>
        <meta
          name="description"
          content="Achieve a balanced and healthier life with fitness, mindfulness, and nourishing food tips."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
      </Head>
      {/* Home Page Content */}
      <main className={classes.container}>
        <DailyList />
        <KeyFeatures />
        <Subscribe />
        {newsArticles.length > 0 && (
          <section className={classes.latestNewsSection}>
            <div className={classes.newsGrid}>
              {newsArticles.map((item) => (
                <div key={item.id} className={classes.newsCard}>
                  <img
                    src={
                      item.image && item.image.trim()
                        ? item.image
                        : "/images/defaultNews.jpg"
                    }
                    alt={item.title || "News image"}
                    className={classes.image}
                    width="400"
                    height="250"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/defaultNews.jpg";
                    }}
                  />
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.readMore}
                  >
                    Read More →
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {showButton && (
          <button onClick={scrollToTop} className={classes.backToTop}>
            ↑
          </button>
        )}
        <DailyList />
      </main>
    </>
  );
}
