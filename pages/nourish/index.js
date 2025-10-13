import path from "path";
import fs from "fs/promises";
import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import nourishHeader from "/public/images/nourish_header.jpg";
import MultiStartQuiz from "../../components/Quiz/QuizPlan/1_StartQuiz";
import NourishHighlights from "../../components/TopPages/NourishHighlights";
import classes from "./index.module.css";
import NourishList from "../../components/nourish/nourish-list";
import ChallengeBox from "../../components/ChallengeBox/ChallengeBox";

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

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wellness Pure Life" />
        <meta
          property="og:title"
          content="Nourish | Healthy Eating, Superfoods & Balanced Meals"
        />
        <meta
          property="og:description"
          content="Explore practical nutrition, superfoods, and supplement basics with easy-to-follow tips for balanced living."
        />
        <meta
          property="og:image"
          content="https://wellnesspurelife.com/images/nourish_header.jpg"
        />
        <meta
          property="og:url"
          content="https://wellnesspurelife.com/nourish"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nourish | Wellness Pure Life" />
        <meta
          name="twitter:description"
          content="Simple, delicious, and smart nutrition. Learn to nourish your body with expert-backed guidance and tips."
        />
        <meta
          name="twitter:image"
          content="https://wellnesspurelife.com/images/nourish_header.jpg"
        />

        {/* Canonical & Favicon */}
        <link rel="canonical" href="https://wellnesspurelife.com/nourish" />
        <link rel="icon" href="/favicon.ico" />

        {/* JSON-LD Structured Data: Breadcrumb & ItemList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbLd, itemListLd]),
          }}
        />
      </Head>

      <header className={classes.header}>
        <Image
          src={nourishHeader}
          alt="Banner showing healthy meals, superfoods, and balanced nutrition — Wellness Pure Life"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 100vw"
        />
      </header>

      <main className={classes["main-content"]}>
        <MultiStartQuiz slug="nourish-plan" />
        <NourishHighlights />
        {/* Educational Overview */}
        <section className={classes.intro}>
          <h2 className={classes.sectionTitle}>
            Foundations of Healthy Nutrition Habits
          </h2>

          <div className={classes.cardGrid}>
            <motion.div
              className={`${classes.card} ${classes.cardCardio}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onClick={() =>
                document
                  .getElementById("superfoodSecrets")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span>🥗</span>
              <h3>Super Food</h3>
            </motion.div>

            <motion.div
              className={`${classes.card} ${classes.cardResistance}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onClick={() =>
                document
                  .getElementById("nutrientEssentials")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span>💧</span>
              <h3>nutrient Essentials</h3>
            </motion.div>

            <motion.div
              className={`${classes.card} ${classes.cardRecovery}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() =>
                document
                  .getElementById("mindfulMeals")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span>🍱</span>
              <h3>mindful Meals</h3>
            </motion.div>

            <motion.div
              className={`${classes.card} ${classes.cardFlexibility}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={() =>
                document
                  .getElementById("dailySupplements")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span>🦠</span>
              <h3>Supplements</h3>
            </motion.div>
          </div>

          {/* Educational Guide */}
          <h2 className={classes.sectionTitle}>
            How to Start Nourishing Better
          </h2>
          <p>
            Begin by adding <strong>1 small habit per week</strong>: drink more
            water, include colorful veggies, or prepare your meals ahead. Build
            a sustainable relationship with food that energizes your body and
            sharpens your mind.
          </p>

          <h2 className={classes.sectionTitle}>Common Nutrition Mistakes</h2>
          <ul>
            <li>Skipping meals or extreme dieting patterns.</li>
            <li>Over-relying on packaged or ultra-processed foods.</li>
            <li>Ignoring hydration and fiber intake.</li>
            <li>Focusing on restriction instead of nourishment.</li>
          </ul>

          <h2 className={classes.sectionTitle}>Additional Resources</h2>
          <p>
            Pair your nutrition journey with mindful practices from our{" "}
            <Link href="/mindfulness">mindfulness section</Link> or
            energy-boosting routines from the{" "}
            <Link href="/fitness">fitness section</Link>. Discover simple
            recipes, expert insights, and tips to fuel your best self.
          </p>

          <blockquote>
            <em>
              “Healthy eating is not about strict rules — it's about creating a
              rhythm that feeds your life.”
            </em>
          </blockquote>
          <hr />
          <ChallengeBox
            title="Nourish Your Body in 21 Days"
            description="Enjoy daily nutrition goals, simple recipes, and mindful eating habits that help you feel lighter, healthier, and more energized — one bite at a time."
            href="/challenge/21-days-nourish/1"
            color="#fbc02d" // Sunny yellow for warmth and vitality
          />
        </section>

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
