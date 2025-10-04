import Head from "next/head";
import fs from "fs/promises";
import path from "path";
import Content from "../../components/mindfulness/content";
import AuthorBox from "../../components/UI/AuthorBox";
import { useState, useEffect } from "react";
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

  const pageTitle = `${conciseTitle} | Mindfulness`;

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
        <meta name="description" content={mindData.summary} />
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
    if (!data) {
      return { notFound: true };
    }

    const allItems = Object.values(data).flat();
    const item = allItems.find((item) => item.id === mindfulnessId);

    if (!item) {
      return { notFound: true };
    }

    return {
      props: { mindData: item },
      revalidate: 60,
    };
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
