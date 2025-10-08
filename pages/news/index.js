import { useState, useEffect } from "react";
import Head from "next/head";
import { fetchNews } from "../../utils/fetch";
import Link from "next/link";
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
      </Head>{" "}
      <div className={classes.pageWrapper}>
        {/* LEFT: News Content */}
        <div className={classes.newsPage}>
          <h1 className={classes.newsHeader}>Latest Health & Wellness News</h1>

          {/* <AdBlock
          adSlot="1234567890"
          className={`${classes.adBlock} ${classes.adTop}`}
        /> */}

          {loading ? (
            <p className={classes.loading}>Loading news...</p>
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

          {/* <AdBlock
          adSlot="2345678901"
          className={`${classes.adBlock} ${classes.adBottom}`}
        /> */}
        </div>

        {/* RIGHT: Google Ad */}
        {/* 
      <AdSidebar adSlots={["1234567890", "2345678901", "3456789012"]} />
      */}
      </div>
    </>
  );
}
