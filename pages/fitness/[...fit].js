import Head from "next/head";
import fs from "fs/promises";
import path from "path";
import { useState, useEffect } from "react";
import Content from "../../components/fitness/content";
import classes from "./index.module.css";

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

  const pageTitle = `${conciseTitle} | Fitness`;

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
        <title>{pageTitle}</title>
        <meta name="description" content={fitData.description} />
      </Head>
      <Content items={fitData} />
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
    const filePath = path.join(process.cwd(), "data", "fitness.json");
    const jsonData = await fs.readFile(filePath);
    const data = JSON.parse(jsonData);
    return data;
  } catch (error) {
    console.error("❌ Error fetching fitness data:", error.message);
    return null; // ✅ Return `null` instead of crashing the app
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

    // ✅ Merge all fitness categories into a single array
    const allItems = Object.values(data).flat();

    // ✅ Find the requested fitness item
    const item = allItems.find((item) => item.id === fitnessId);

    if (!item) {
      return { notFound: true };
    }

    return {
      props: { fitData: item },
      revalidate: 60, // ✅ Revalidates data every 60 seconds
    };
  } catch (error) {
    console.error("❌ Error fetching fitness data:", error.message);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  const data = await getData();

  const paths = [];
  Object.values(data).forEach((category) => {
    category.forEach((item) => {
      paths.push({ params: { fit: [item.id] } });
    });
  });

  return { paths, fallback: true };
}

export default fitnessDetailsPage;
