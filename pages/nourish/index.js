import path from "path";
import fs from "fs/promises";
import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import nourishHeader from "./../../public/images/nourish_header.jpg";
import MultiStartQuiz from "../../components/Quiz/QuizPlan/1_StartQuiz";
import NourishHighlights from "../../components/TopPages/NourishHighlights";
import classes from "./index.module.css";
import NourishList from "../../components/nourish/nourish-list";

function NourishPage(props) {
  const [showButton, setShowButton] = useState(false);

  const categories = [
    { key: "featured", title: "FEATURED", items: props.featured },
    {
      key: "superfoodSecrets",
      title: "SUPERFOOD SECRETS",
      items: props.superfoodSecrets,
    },
    {
      key: "nutrientEssentials",
      title: "NUTRIENT ESSENTIALS",
      items: props.nutrientEssentials,
    },
    { key: "mindfulMeals", title: "MINDFUL MEALS", items: props.mindfulMeals },
    {
      key: "dailySupplements",
      title: "DAILY SUPPLEMENTS",
      items: props.dailySupplements,
    },
  ];

  // Highlight active sub-nav item while scrolling (IO + sticky offset aware)
  useEffect(() => {
    const links = Array.from(
      document.querySelectorAll(`.${classes.subnavLink}`)
    );
    const sections = (categories || [])
      .map((c) => document.getElementById(c.key))
      .filter(Boolean);

    if (!links.length || !sections.length) return;

    // Height of the sticky subnav; fall back if not measurable yet
    const SUBNAV = document.querySelector(`.${classes.subnav}`);
    const OFFSET = (SUBNAV?.offsetHeight || 80) + 8; // +8px breathing room

    const setActive = (id) => {
      links.forEach((a) =>
        a.classList.toggle(classes.active, a.getAttribute("data-key") === id)
      );
    };

    // Pick the section that has most recently crossed the OFFSET line
    const pickCurrent = () => {
      const cursor = OFFSET + 1; // line just below sticky bar
      const rects = sections.map((s) => ({
        id: s.id,
        top: s.getBoundingClientRect().top,
      }));
      // last section whose top is above the cursor; else the first section
      const crossed = rects.filter((r) => r.top <= cursor);
      const current = crossed.length
        ? crossed.reduce((a, b) => (a.top > b.top ? a : b))
        : rects[0];
      setActive(current.id);
    };

    const io = new IntersectionObserver(
      () => {
        // We ignore IO's entries and compute from ALL sections for reliability.
        pickCurrent();
      },
      {
        root: null,
        rootMargin: `-${OFFSET}px 0px -60% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((s) => io.observe(s));

    // Prime state + keep in sync on resize/hash changes
    pickCurrent();
    const onResize = () => pickCurrent();
    window.addEventListener("resize", onResize);
    window.addEventListener("hashchange", pickCurrent);

    // Also update immediately on chip click for instant feedback
    const clickHandlers = links.map((a) => {
      const id = a.getAttribute("data-key");
      const h = () => setActive(id);
      a.addEventListener("click", h);
      return { a, h };
    });

    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("hashchange", pickCurrent);
      clickHandlers.forEach(({ a, h }) => a.removeEventListener("click", h));
    };
  }, [categories]);

  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // --- Structured Data (Breadcrumb + ItemList for featured) ---
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://wellnesspurelife.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Nourish",
        item: "https://wellnesspurelife.com/nourish",
      },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: (props.featured || []).map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `https://wellnesspurelife.com/nourish/${it.id}`,
      name: it.title,
    })),
  };

  return (
    <>
      <Head>
        <title>Nourish | Healthy Eating, Superfoods & Balanced Meals</title>
        <meta
          name="description"
          content="Healthy eating made simple: practical nutrition guides, superfood explainers, mindful meals, and supplement basics—backed by clear steps and realistic tips."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbLd, itemListLd]),
          }}
        />
      </Head>

      <header className={classes.header}>
        <nav>
          <Image
            src={nourishHeader}
            alt="Colorful whole foods and balanced plates — WellnessPureLife Nourish"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 100vw"
          />
        </nav>
      </header>

      <main className={classes["main-content"]}>
        <MultiStartQuiz slug="nourish-plan" />
        <NourishHighlights />
        {/* Sticky sub-nav */}
        <nav className={classes.subnav} aria-label="Section navigation">
          <div className={classes.subnavWrapper}>
            <ul className={classes.subnavList} role="list">
              {categories.map((c) => (
                <li key={c.key}>
                  <a
                    className={classes.subnavLink}
                    href={`#${c.key}`}
                    data-key={c.key}
                  >
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* --- Category Sections with ids --- */}
        {categories.map((category) => {
          const headingId = `${category.key}-heading`;
          return (
            <section
              key={category.key}
              id={category.key}
              aria-labelledby={headingId}
              className={classes.section}
            >
              <h2 id={headingId} className={classes["left-align"]}>
                {category.title}
              </h2>
              <hr />
              <div className={classes["nourish-container"]}>
                <NourishList items={category.items} />
              </div>
            </section>
          );
        })}

        {showButton && (
          <button
            onClick={scrollToTop}
            className={classes.backToTop}
            aria-label="Back to top"
          >
            ↑
          </button>
        )}
      </main>
    </>
  );
}

export async function getStaticProps() {
  try {
    const filePath = path.join(process.cwd(), "data", "nourish.json");
    const jsonData = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(jsonData);

    if (!data || typeof data !== "object") {
      throw new Error("Invalid or missing nourish.json data.");
    }

    return {
      props: {
        featured: data.featured || [],
        superfoodSecrets: data.superfoodSecrets || [],
        nutrientEssentials: data.nutrientEssentials || [],
        mindfulMeals: data.mindfulMeals || [],
        dailySupplements: data.dailySupplements || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("❌ Error fetching nourish data:", error.message);
    return {
      props: {
        featured: [],
        superfoodSecrets: [],
        nutrientEssentials: [],
        mindfulMeals: [],
        dailySupplements: [],
      },
    };
  }
}

export default NourishPage;
