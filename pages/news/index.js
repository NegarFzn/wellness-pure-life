import { useState, useEffect } from "react";
import Head from "next/head";
import { fetchNews } from "../../utils/fetch";
import Link from "next/link";
import { gaEvent } from "../../lib/gtag";
import classes from "./index.module.css";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // PAGE VIEW EVENTS
  // ----------------------------
  useEffect(() => {
    gaEvent("news_page_view");
    gaEvent("key_news_page_view");
  }, []);

  // ----------------------------
  // FETCH NEWS + ERROR / EMPTY ANOMALY DETECTION
  // ----------------------------
  useEffect(() => {
    async function getNews() {
      try {
        const newsData = await fetchNews();

        if (!newsData || newsData.length === 0) {
          gaEvent("news_empty_response");
          gaEvent("key_news_empty_response");
        }

        setArticles(newsData);
      } catch (err) {
        gaEvent("news_fetch_error", { message: err.message });
        gaEvent("key_news_fetch_error", { message: err.message });
      }

      setLoading(false);
    }

    getNews();
  }, []);

  // ----------------------------
  // IMPRESSION TRACKING (ON SCROLL)
  // ----------------------------
  useEffect(() => {
    if (!articles.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = entry.target.getAttribute("data-slug");

            gaEvent("news_item_impression", { slug });
            gaEvent("key_news_item_impression", { slug });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 },
    );

    document
      .querySelectorAll("[data-slug]")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [articles]);

  return (
    <>
      <Head>
        <title>Latest Health & Wellness News | Wellness Pure Life</title>
        <meta
          name="description"
          content="Read the latest news in fitness, nutrition, and mental well-being. Stay updated with expert tips from Wellness Pure Life."
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Latest Health & Wellness News",
              itemListElement: articles.map((article, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `https://wellnesspurelife.com/news/${article.slug}`,
              })),
            }),
          }}
        />
      </Head>

      <div className={classes.pageWrapper}>
        <div className={classes.newsPage}>
          <h1 className={classes.newsHeader}>Latest Health & Wellness News</h1>

          {loading ? (
            <p className={classes.loading}>Loading news...</p>
          ) : articles.length > 0 ? (
            <ul className={classes.newsList}>
              {articles.map((article) => (
                <li
                  key={article.id}
                  className={classes.newsItem}
                  data-slug={article.slug} // <-- REQUIRED FOR IMPRESSION TRACKING
                >
                  <img
                    src={article.image || "/images/defaultNews.jpg"}
                    alt={article.title}
                    className={classes.newsImage}
                    onError={(e) => {
                      gaEvent("news_image_load_error", { slug: article.slug });
                      e.target.src = "/images/defaultNews.jpg";
                    }}
                  />

                  <h2>{article.title}</h2>
                  <p>{article.summary}</p>

                  <Link
                    href={`/news/${article.slug}`}
                    className={classes.readMore}
                    onClick={() => {
                      gaEvent("news_read_more_click", { slug: article.slug });
                      gaEvent("key_news_read_more_click", {
                        slug: article.slug,
                      });
                    }}
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
      </div>
    </>
  );
}
