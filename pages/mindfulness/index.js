import path from "path";
import fs from "fs/promises";
import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import mindfulnessHeader from "./../../public/images/mindfulness_header.jpg";
import classes from "./index.module.css";
import MindfulnessList from "../../components/mindfulness/mindfulness-list";

function mindfulnessPage(props) {
  const [showButton, setShowButton] = useState(false);

  const categories = [
    { key: "featured", title: "FEATURED", items: props.featured },
    { key: "meditation", title: "MEDITATION", items: props.meditation },
    {
      key: "stressReduction",
      title: "STRESS REDUCTION",
      items: props.stressReduction,
    },
    {
      key: "productivityAndFocus",
      title: "PRODUCTIVITY AND FOCUS",
      items: props.productivityAndFocus,
    },
    {
      key: "mentalWellness",
      title: "MENTAL WELLNESS",
      items: props.mentalWellness,
    },
  ];

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
        <title>Mindfulness | Meditation, Stress Relief & Wellness</title>
        <meta
          name="description"
          content="Discover mindfulness practices to reduce stress, improve focus, and enhance emotional well-being. Explore meditation techniques, stress management tips, and strategies for living in the moment."
        />
      </Head>
      <header className={classes.header}>
        <nav>
          <Image
            src={mindfulnessHeader}
            alt="mindfulness header"
            fill
            priority
          />
        </nav>
      </header>
      <main className={classes["main-content"]}>
        {categories.map((category) => (
          <div key={category.key}>
            {" "}
            <section key={category.key} className={classes.section}>
              <h2 className={classes["left-align"]}>{category.title}</h2>
              <hr />
              <div className={classes["mindfulness-container"]}>
                <MindfulnessList items={category.items} />
              </div>
            </section>
          </div>
        ))}
        {showButton && (
          <button onClick={scrollToTop} className={classes.backToTop}>
            ↑
          </button>
        )}
      </main>
    </>
  );
}

export async function getStaticProps(context) {
  try {
    const filePath = path.join(process.cwd(), "data", "mindfulness.json");
    const jsonData = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(jsonData);

    if (!data || typeof data !== "object") {
      throw new Error("Invalid or missing mindfulness.json data.");
    }

    return {
      props: {
        featured: data.featured || [],
        meditation: data.meditation || [],
        stressReduction: data.stressReduction || [],
        productivityAndFocus: data.productivityAndFocus || [],
        mentalWellness: data.mentalWellness || [],
      },
      revalidate: 60, // ✅ Fetch fresh data every 60 seconds
    };
  } catch (error) {
    console.error("Error reading mindfulness data:", error.message);
    return {
      props: {
        featured: [],
        meditation: [],
        stressReduction: [],
        productivityAndFocus: [],
        mentalWellness: [],
      },
    };
  }
}

export default mindfulnessPage;
