import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import { fetchNews } from "../../utils/fetch";
import { gaEvent } from "../../lib/gtag";
import classes from "./index.module.css";
import ReactMarkdown from "react-markdown";

export default function NewsDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [article, setArticle] = useState(null);

  // -----------------------------
  // ANOMALY: Missing slug
  // -----------------------------
  useEffect(() => {
    if (!slug) {
      gaEvent("news_slug_missing");
    }
  }, [slug]);

  // -----------------------------
  // Fetch article
  // -----------------------------
  useEffect(() => {
    async function getArticle() {
      try {
        const articles = await fetchNews();
        const found = articles.find((item) => item.slug === slug);

        if (!found) {
          gaEvent("news_article_not_found", { slug });
          setArticle(null);
          return;
        }

        setArticle(found);
      } catch (err) {
        console.error("Failed to load article:", err);
        gaEvent("news_load_error", { slug, message: err.message });
        setArticle(null);
      }
    }

    if (slug) getArticle();
  }, [slug]);

  // -----------------------------
  // ANALYTICS: Article view
  // -----------------------------
  useEffect(() => {
    if (!article) return;

    gaEvent("news_article_view", {
      slug: article.slug,
      title: article.title,
    });

    gaEvent("key_news_article_view", { slug: article.slug });
  }, [article]);

  // -----------------------------
  // ANOMALY: Empty content
  // -----------------------------
  useEffect(() => {
    if (article && (!article.content || article.content.trim() === "")) {
      gaEvent("news_article_empty_content", { slug: article.slug });
    }
  }, [article]);

  // -----------------------------
  // ANALYTICS: Scroll depth tracking
  // -----------------------------
  useEffect(() => {
    if (!article) return;

    const marks = [25, 50, 75, 100];
    let fired = {};

    const onScroll = () => {
      const pct =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;

      marks.forEach((m) => {
        if (pct >= m && !fired[m]) {
          fired[m] = true;

          gaEvent("news_scroll_depth", {
            slug: article.slug,
            percent: m,
          });

          gaEvent("key_news_scroll_depth", {
            percent: m,
          });
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [article]);

  if (!article) return <p className={classes.loading}>Loading article...</p>;

  return (
    <>
      <Head>
        <title>{article.title} | Wellness Pure Life</title>
        <meta name="description" content={article.summary} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://wellnesspurelife.com/news/${article.slug}`,
              },
              headline: article.title,
              image: [
                article.image ||
                  "https://wellnesspurelife.com/images/social-card.jpg",
              ],
              datePublished: article.publishedAt || new Date().toISOString(),
              dateModified: article.publishedAt || new Date().toISOString(),
              author: {
                "@type": "Organization",
                name: "Wellness Pure Life",
              },
              publisher: {
                "@type": "Organization",
                name: "Wellness Pure Life",
                logo: {
                  "@type": "ImageObject",
                  url: "https://wellnesspurelife.com/logo.jpg",
                },
              },
              description: article.summary,
            }),
          }}
        />
      </Head>

      <div className={classes.pageWrapper}>
        <div className={classes.newsP}>
          <div className={classes.header}>
            <h1 className={classes.title}>{article.title}</h1>

            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className={classes.newsImage}
              />
            )}

            <p className={classes.newsSummary}>{article.summary}</p>

            {article.publishedAt && (
              <div className={classes.metadata}>
                <span className={classes.date}>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <div className={classes.newsContent}>
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          {article.isGenerated && (
            <p className={classes.generatedLabel}>
              ⚡ This article was generated by AI
            </p>
          )}
        </div>
      </div>
    </>
  );
}
