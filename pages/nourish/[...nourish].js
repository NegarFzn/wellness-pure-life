import Head from "next/head";
import fs from "fs/promises";
import path from "path";
import { useState, useEffect } from "react";
import { gaEvent } from "../../lib/gtag";
import Content from "../../components/nourish/content";
import AuthorBox from "../../components/UI/AuthorBox";
import classes from "./index.module.css";

function NourishDetailPage(props) {
  const { nourishData } = props;
  const [showButton, setShowButton] = useState(false);

  // ---- PAGE VIEW ANALYTICS ----
  useEffect(() => {
    if (!nourishData) return;

    gaEvent("nourish_detail_view", {
      id: nourishData.id,
      title: nourishData.title,
    });

    gaEvent("key_nourish_detail_view", {
      id: nourishData.id,
    });

    // ---- ANOMALY: empty content ----
    if (!nourishData.title || !nourishData.summary) {
      gaEvent("anomaly_nourish_missing_fields", {
        id: nourishData.id,
      });
    }
  }, [nourishData]);

  if (!nourishData) {
    return <p style={{ textAlign: "center" }}>Nourish content not found.</p>;
  }

  const maxLength = 20;
  const conciseTitle =
    nourishData.title.length > maxLength
      ? `${nourishData.title.slice(0, maxLength - 3)}...`
      : nourishData.title;

  const pageTitle = `${conciseTitle} | Healthy Nutrition Guide | Wellness Pure Life`;

  // ---- Scroll-to-top button visibility ----
  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 300;
      setShowButton(show);

      if (show) {
        gaEvent("nourish_detail_scroll_depth", {
          depth: window.scrollY,
          id: nourishData.id,
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nourishData.id]);

  const scrollToTop = () => {
    gaEvent("nourish_detail_scroll_to_top_click", {
      id: nourishData.id,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={nourishData.summary?.slice(0, 160)} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />

        <link
          rel="canonical"
          href={`https://wellnesspurelife.com/nourish/${nourishData.id}`}
        />
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Wellness Pure Life" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={nourishData.summary} />
        <meta
          property="og:image"
          content={`https://wellnesspurelife.com/images/nourish/${nourishData.image}`}
        />
        <meta
          property="og:url"
          content={`https://wellnesspurelife.com/nourish/${nourishData.id}`}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={nourishData.summary} />
        <meta
          name="twitter:image"
          content={`https://wellnesspurelife.com/images/nourish/${nourishData.image}`}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: nourishData.title,
              description: nourishData.summary,
              author: {
                "@type": "Organization",
                name: "Wellness Pure Life",
              },
              publisher: {
                "@type": "Organization",
                name: "Wellness Pure Life",
                logo: {
                  "@type": "ImageObject",
                  url: "https://wellnesspurelife.com/logo.png",
                },
              },
              datePublished: nourishData.date || "2025-01-01",
              image: `https://wellnesspurelife.com/images/nourish/${nourishData.image}`,
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://wellnesspurelife.com/nourish/${nourishData.id}`,
              },
            }),
          }}
        />
      </Head>

      <Content items={nourishData} />

      {/* ---- Author box view event ---- */}
      <AuthorBox
        onView={() =>
          gaEvent("nourish_detail_authorbox_view", { id: nourishData.id })
        }
      />

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
    const filePath = path.join(process.cwd(), "data", "nourish.json");
    const jsonData = await fs.readFile(filePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("❌ Error reading nourish data:", error.message);
    return null;
  }
}

export async function getStaticProps(context) {
  try {
    if (!context || !context.params) {
      throw new Error("Invalid context: params missing.");
    }

    const { params } = context;
    if (!params.nourish || params.nourish.length === 0) {
      throw new Error("Invalid URL: Nourish ID is missing.");
    }

    const nourishId = params.nourish[0];
    const data = await getData();

    if (!data) return { notFound: true };

    const allItems = Object.values(data).flat();
    const item = allItems.find((item) => item.id === nourishId);

    if (!item) return { notFound: true };

    return {
      props: { nourishData: item },
      revalidate: 60,
    };
  } catch (error) {
    console.error("❌ Error fetching nourish data:", error.message);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  const data = await getData();

  const paths = [];
  Object.values(data).forEach((category) => {
    category.forEach((item) => {
      paths.push({ params: { nourish: [item.id] } });
    });
  });

  return { paths, fallback: true };
}

export default NourishDetailPage;
