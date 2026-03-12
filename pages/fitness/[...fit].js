import Head from "next/head";
import fs from "fs/promises";
import path from "path";
import { useState, useEffect } from "react";
import Content from "../../components/fitness/content";
import AuthorBox from "../../components/UI/AuthorBox";
import classes from "./index.module.css";
import { gaEvent } from "../../lib/gtag";

function fitnessDetailsPage(props) {
  const { fitData } = props;
  const [showButton, setShowButton] = useState(false);

  if (!fitData) {
    return <p style={{ textAlign: "center" }}>Fitness content not found.</p>;
  }

  const maxLength = 15;
  const conciseTitle =
    fitData.title.length > maxLength
      ? `${fitData.title.slice(0, maxLength - 3)}...`
      : fitData.title;

  // -------------------------------
  // GA4: Article View Event
  // -------------------------------
  useEffect(() => {
    if (fitData?.id) {
      gaEvent("fitness_article_view", {
        id: fitData.id,
        title: fitData.title,
      });
    }
  }, [fitData]);

  // -------------------------------
  // Optimized Scroll Listener
  // -------------------------------
  useEffect(() => {
    let timeout = null;

    const handleScroll = () => {
      if (timeout) return;
      timeout = setTimeout(() => {
        setShowButton(window.scrollY > 300);
        timeout = null;
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Head>
        <title>{`${conciseTitle} | Fitness | Wellness Pure Life`}</title>
        <meta name="description" content={fitData.description} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Wellness Pure Life" />
        <meta
          property="og:title"
          content={`${fitData.title} | Fitness | Wellness Pure Life`}
        />
        <meta property="og:description" content={fitData.description} />
        <meta
          property="og:image"
          content={`https://wellnesspurelife.com${
            fitData.image || "/images/social-card.jpg"
          }`}
        />
        <meta
          property="og:url"
          content={`https://wellnesspurelife.com/fitness/${fitData.id}`}
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${fitData.title} | Fitness`} />
        <meta name="twitter:description" content={fitData.description} />
        <meta
          name="twitter:image"
          content={`https://wellnesspurelife.com${
            fitData.image || "/images/social-card.jpg"
          }`}
        />

        {/* Canonical & Favicon */}
        <link
          rel="canonical"
          href={`https://wellnesspurelife.com/fitness/${fitData.id}`}
        />
        <link rel="icon" href="/favicon.ico" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: fitData.title,
              description: fitData.description,

              datePublished: fitData.date || "2025-01-01",
              dateModified: fitData.date || "2025-01-01",

              url: `https://wellnesspurelife.com/fitness/${fitData.id}`,
              image: `https://wellnesspurelife.com${fitData.image || "/images/social-card.jpg"}`,

              author: {
                "@type": "Organization",
                name: "Wellness Pure Life",
              },

              publisher: {
                "@type": "Organization",
                name: "Wellness Pure Life",
                logo: {
                  "@type": "ImageObject",
                  url: "https://wellnesspurelife.com/images/social-card.jpg",
                },
              },

              mainEntityOfPage: `https://wellnesspurelife.com/fitness/${fitData.id}`,
            }),
          }}
        />
      </Head>

      <Content items={fitData} />
      <AuthorBox />

      {showButton && (
        <button onClick={scrollToTop} className={classes.backToTop}>
          ↑
        </button>
      )}
    </div>
  );
}

// ----------------------------------------------------
// Data Fetch Helpers
// ----------------------------------------------------
async function getData() {
  try {
    const filePath = path.join(process.cwd(), "data", "fitness.json");
    const jsonData = await fs.readFile(filePath);
    const data = JSON.parse(jsonData);
    return data;
  } catch (error) {
    console.error("❌ Error fetching fitness data:", error.message);
    return null;
  }
}

export async function getStaticProps(context) {
  try {
    if (!context || !context.params) {
      throw new Error("Invalid context object: params missing.");
    }

    const { params } = context;
    if (!params.fit || params.fit.length === 0) {
      throw new Error("Invalid URL: Fitness ID is missing.");
    }

    const fitnessId = params.fit[0];
    const data = await getData();

    if (!data) {
      return { notFound: true };
    }

    const allItems = Object.values(data).flat();
    const item = allItems.find((item) => item.id === fitnessId);

    if (!item) {
      return { notFound: true };
    }

    return {
      props: { fitData: item },
      revalidate: 60,
    };
  } catch (error) {
    console.error("❌ Error fetching fitness data:", error.message);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  const data = await getData();

  if (!data) {
    return { paths: [], fallback: true };
  }

  const paths = [];
  Object.values(data).forEach((category) => {
    category.forEach((item) => {
      paths.push({ params: { fit: [item.id] } });
    });
  });

  return { paths, fallback: true };
}

export default fitnessDetailsPage;
