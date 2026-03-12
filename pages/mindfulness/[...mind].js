import Head from "next/head";
import fs from "fs/promises";
import path from "path";
import Content from "../../components/mindfulness/content";
import AuthorBox from "../../components/UI/AuthorBox";
import { useState, useEffect } from "react";
import { gaEvent } from "../../lib/gtag";
import classes from "./index.module.css";

function MindfulnessDetailPage(props) {
  const { mindData } = props;
  const [showButton, setShowButton] = useState(false);

  if (!mindData) {
    return (
      <p style={{ textAlign: "center" }}>Mindfulness content not found.</p>
    );
  }

  const maxLength = 20;
  const conciseTitle =
    mindData.title.length > maxLength
      ? `${mindData.title.slice(0, maxLength - 3)}...`
      : mindData.title;

  const pageTitle = `${conciseTitle} | Mindfulness Meditation Guide | Wellness Pure Life`;

  // -------------------------
  // ANALYTICS: PAGE VIEW
  // -------------------------
  useEffect(() => {
    gaEvent("mindfulness_article_view", {
      id: mindData.id,
      title: mindData.title,
    });

    gaEvent("key_mindfulness_article_view", {
      id: mindData.id,
    });
  }, [mindData.id, mindData.title]);

  // -------------------------
  // ANALYTICS: SCROLL DEPTH
  // -------------------------
  useEffect(() => {
    const checkpoints = [25, 50, 75, 100];
    let fired = {};

    const onScroll = () => {
      const scrolled =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;

      checkpoints.forEach((pct) => {
        if (scrolled >= pct && !fired[pct]) {
          fired[pct] = true;
          gaEvent("mindfulness_scroll_depth", {
            percent: pct,
            id: mindData.id,
          });
          gaEvent("key_mindfulness_scroll_depth", { percent: pct });
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [mindData.id]);

  // -------------------------
  // ANALYTICS: SECTION VIEW
  // Detects when Content sections enter viewport
  // -------------------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const heading = entry.target.getAttribute("data-section");
            gaEvent("mindfulness_section_view", {
              section: heading,
              id: mindData.id,
            });
            gaEvent("key_mindfulness_section_view", { section: heading });
          }
        });
      },
      { threshold: 0.4 },
    );

    setTimeout(() => {
      document.querySelectorAll("[data-section]").forEach((el) => {
        observer.observe(el);
      });
    }, 600);

    return () => observer.disconnect();
  }, [mindData.id]);

  // -------------------------
  // Show Back-to-Top Button
  // -------------------------
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={mindData.summary?.slice(0, 160)} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Wellness Pure Life" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={mindData.summary} />
        <meta
          property="og:image"
          content={`https://wellnesspurelife.com/${mindData.image}`}
        />
        <meta
          property="og:url"
          content={`https://wellnesspurelife.com/mindfulness/${mindData.id}`}
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={mindData.summary} />
        <meta
          name="twitter:image"
          content={`https://wellnesspurelife.com/${mindData.image}`}
        />

        {/* Canonical & Favicon */}
        <link
          rel="canonical"
          href={`https://wellnesspurelife.com/mindfulness/${mindData.id}`}
        />
        <link rel="icon" href="/favicon.ico" />

        {/* Article Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: mindData.title,
              description: mindData.summary,

              datePublished: mindData.date || "2025-01-01",
              dateModified: mindData.date || "2025-01-01",

              image: [`https://wellnesspurelife.com/${mindData.image}`],

              author: {
                "@type": "Person",
                name: "Bayan Negar Fozooni",
              },

              publisher: {
                "@type": "Organization",
                name: "Wellness Pure Life",
                logo: {
                  "@type": "ImageObject",
                  url: "https://wellnesspurelife.com/logo.png",
                },
              },

              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://wellnesspurelife.com/mindfulness/${mindData.id}`,
              },
            }),
          }}
        />
      </Head>

      <Content items={mindData} />

      <AuthorBox />

      {showButton && (
        <button onClick={scrollToTop} className={classes.backToTop}>
          ↑
        </button>
      )}
    </div>
  );
}

async function getData() {
  try {
    const filePath = path.join(process.cwd(), "data", "mindfulness.json");
    const jsonData = await fs.readFile(filePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("❌ Error reading mindfulness data:", error.message);
    return null;
  }
}

export async function getStaticProps(context) {
  try {
    const { params } = context;
    const mindfulnessId = params.mind[0];

    const data = await getData();
    if (!data) return { notFound: true };

    const allItems = Object.values(data).flat();
    const item = allItems.find((item) => item.id === mindfulnessId);
    if (!item) return { notFound: true };

    return { props: { mindData: item }, revalidate: 60 };
  } catch (error) {
    console.error("❌ Error fetching mindfulness data:", error.message);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  const data = await getData();
  const paths = [];

  Object.values(data).forEach((category) => {
    category.forEach((item) => {
      paths.push({ params: { mind: [item.id] } });
    });
  });

  return { paths, fallback: true };
}

export default MindfulnessDetailPage;
