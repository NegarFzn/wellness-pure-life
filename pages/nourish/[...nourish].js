import Head from "next/head";
import fs from "fs/promises";
import path from "path";
import { useState, useEffect } from "react";
import Content from "../../components/nourish/content";
import AuthorBox from "../../components/UI/AuthorBox";
import classes from "./index.module.css";

function NourishDetailPage(props) {
  const { nourishData } = props;
  const [showButton, setShowButton] = useState(false);

  if (!nourishData) {
    return <p style={{ textAlign: "center" }}>Nourish content not found.</p>;
  }

  const maxLength = 20;
  const conciseTitle =
    nourishData.title.length > maxLength
      ? `${nourishData.title.slice(0, maxLength - 3)}...`
      : nourishData.title;

  const pageTitle = `${conciseTitle} | Nourish`;

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
    <div>
      <Head>
        {/* SEO Title & Description */}
        <title>{pageTitle}</title>
        <meta name="description" content={nourishData.summary} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://wellnesspurelife.com/nourish/${nourishData.id}`}
        />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph Meta Tags */}
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

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={nourishData.summary} />
        <meta
          name="twitter:image"
          content={`https://wellnesspurelife.com/images/nourish/${nourishData.image}`}
        />

        {/* Article Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: nourishData.title,
              description: nourishData.summary,
              author: {
                "@type": "Person",
                name: "Wellness Pure Life Team",
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
