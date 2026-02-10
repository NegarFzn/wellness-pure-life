import path from "path";
import fs from "fs/promises";
import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import mindfulnessHeader from "/public/images/mindfulness_header.jpg";
import MindfulnessHighlights from "../../components/TopPages/MindfulnessHighlights";
import MultiStartQuiz from "../../components/Quiz/QuizPlan/1_StartQuiz";
import { gaEvent } from "../../lib/gtag";
import classes from "./index.module.css";
import MindfulnessList from "../../components/mindfulness/mindfulness-list";
import ChallengeCard from "../../components/ChallengeCard/ChallengeCard";

function MindfulnessPage(props) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    let music;

    const fadeIn = (target = 0.35, speed = 0.015) => {
      const interval = setInterval(() => {
        if (music && music.volume < target) {
          music.volume = Math.min(music.volume + speed, target);
        } else {
          clearInterval(interval);
        }
      }, 150);
    };

    const fadeOut = (speed = 0.02) => {
      const interval = setInterval(() => {
        if (music && music.volume > 0) {
          music.volume = Math.max(music.volume - speed, 0);
        } else {
          clearInterval(interval);
          music?.pause();
        }
      }, 120);
    };

    const createAndPlay = () => {
      if (!music) {
        music = new Audio("/audio/mindfulness-background.mp3");
        music.volume = 0;
        music.loop = true;
      }
      music.play().then(() => fadeIn());
    };

    // Attempt autoplay
    createAndPlay();

    // Fallback if autoplay blocked
    const unlock = () => {
      createAndPlay();
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };

    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);

    return () => fadeOut();
  }, []);

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

  // Highlight active sub-nav item while scrolling (IO + sticky offset aware)
  useEffect(() => {
    const timer = setTimeout(() => {
      const links = Array.from(
        document.querySelectorAll(`.${classes.subnavLink}`),
      );

      const sections = (categories || [])
        .map((c) => document.getElementById(c.key))
        .filter(Boolean);

      if (!links.length || !sections.length) return;

      const SUBNAV = document.querySelector(`.${classes.subnav}`);
      const OFFSET = (SUBNAV?.offsetHeight || 80) + 8;

      const setActive = (id) => {
        links.forEach((a) =>
          a.classList.toggle(classes.active, a.getAttribute("data-key") === id),
        );
      };
      let lastSection = null;

      const pickCurrent = () => {
        const cursor = OFFSET + 1;
        const rects = sections.map((s) => ({
          id: s.id,
          top: s.getBoundingClientRect().top,
        }));

        const crossed = rects.filter((r) => r.top <= cursor);
        const current = crossed.length
          ? crossed.reduce((a, b) => (a.top > b.top ? a : b))
          : rects[0];

        const id = current.id; // FIX — define id

        setActive(id);

        if (id !== lastSection) {
          lastSection = id;
          gaEvent("mindfulness_section_view", { section: id });
          gaEvent("key_mindfulness_section_view", { section: id });
        }
      };

      const io = new IntersectionObserver(() => pickCurrent(), {
        root: null,
        rootMargin: `-${OFFSET}px 0px -60% 0px`,
        threshold: 0.2,
      });

      sections.forEach((s) => io.observe(s));

      pickCurrent();
      const onResize = () => pickCurrent();
      window.addEventListener("resize", onResize);
      window.addEventListener("hashchange", pickCurrent);

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
    }, 50);

    return () => clearTimeout(timer);
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
        name: "Mindfulness",
        item: "https://wellnesspurelife.com/mindfulness",
      },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: (props.featured || []).map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `https://wellnesspurelife.com/mindfulness/${it.id}`,
      name: it.title,
    })),
  };

  return (
    <>
      <Head>
        <title>Mindfulness | Meditation, Stress Relief & Wellness</title>
        <meta
          name="description"
          content="Reduce stress, improve focus, and build emotional resilience with practical mindfulness. Step-by-step meditations, breathing techniques, and science-backed habits for everyday calm."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wellness Pure Life" />
        <meta
          property="og:title"
          content="Mindfulness | Meditation, Stress Relief & Wellness"
        />
        <meta
          property="og:description"
          content="Reduce stress, improve focus, and build emotional resilience with practical mindfulness. Step-by-step meditations, breathing techniques, and science-backed habits for everyday calm."
        />
        <meta
          property="og:image"
          content="https://wellnesspurelife.com/images/social-card.jpg"
        />
        <meta
          property="og:url"
          content="https://wellnesspurelife.com/mindfulness"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mindfulness | Wellness Pure Life" />
        <meta
          name="twitter:description"
          content="Step into calm with science-backed meditations, breathing techniques, and stress relief strategies for everyday peace."
        />
        <meta
          name="twitter:image"
          content="https://wellnesspurelife.com/images/social-card.jpg"
        />

        {/* Canonical & Favicon */}
        <link rel="canonical" href="https://wellnesspurelife.com/mindfulness" />
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
        <nav>
          <Image
            src={mindfulnessHeader}
            alt="Banner showing meditation, breathing practices, and mindful living — Wellness Pure Life"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 100vw"
          />
        </nav>
      </header>

      <main className={classes["main-content"]}>
        <MultiStartQuiz slug="mindfulness-plan" />
        <MindfulnessHighlights />
        {/* 🎧 Guided Audio Meditations */}
        <section className={classes.audioSection}>
          <h2 className={classes.sectionTitle}>Guided Audio Meditations</h2>
          <p className={classes.sectionSubtitle}>
            Find your calm with short, science-backed meditations.
          </p>

          <div className={classes.audioBlock}>
            <h3 className={classes.audioTitle}>
              Short Morning Focus Meditation
            </h3>
            <p className={classes.audioCTA}>
              Tap play to begin your calm moment…
            </p>

            <div className={classes.audioWrapper}>
              <audio controls className={classes.audioPlayer}>
                <source src="/audio/morning-focus.mp3" type="audio/mpeg" />
              </audio>
            </div>
          </div>
        </section>

        {/* Educational Overview */}
        <section className={classes.intro}>
          <h2 className={classes.sectionTitle}>
            Foundations of Mindfulness Practice
          </h2>

          <div className={classes.cardGrid}>
            <motion.div
              className={`${classes.card} ${classes.cardCardio}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onClick={() => {
                const el = document.getElementById("meditation");
                const offset = 80;
                if (el) {
                  const top =
                    el.getBoundingClientRect().top + window.scrollY - offset;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
            >
              <span>🧘‍♂️</span>
              <h3>meditation</h3>
            </motion.div>

            <motion.div
              className={`${classes.card} ${classes.cardResistance}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onClick={() => {
                const el = document.getElementById("stressReduction");
                const offset = 80;
                if (el) {
                  const top =
                    el.getBoundingClientRect().top + window.scrollY - offset;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
            >
              <span>🌬️</span>
              <h3>stress reduction</h3>
            </motion.div>

            <motion.div
              className={`${classes.card} ${classes.cardRecovery}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() => {
                const el = document.getElementById("productivityAndFocus");
                const offset = 80;
                if (el) {
                  const top =
                    el.getBoundingClientRect().top + window.scrollY - offset;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
            >
              <span>😴</span>
              <h3>Focus</h3>
            </motion.div>

            <motion.div
              className={`${classes.card} ${classes.cardFlexibility}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={() => {
                const el = document.getElementById("mentalWellness");
                const offset = 80;
                if (el) {
                  const top =
                    el.getBoundingClientRect().top + window.scrollY - offset;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
            >
              <span>📔</span>
              <h3>mental wellness</h3>
            </motion.div>
          </div>

          {/* Educational Guide */}
          <h2 className={classes.sectionTitle}>How to Begin Your Practice</h2>
          <p>
            Start with <strong>5–10 minutes daily</strong> of mindful breathing
            or guided meditation. Gradually build a consistent routine that
            supports your emotional balance and mental clarity.{" "}
            <em>It's not about perfection — it's about presence.</em>
          </p>

          <h2 className={classes.sectionTitle}>Common Mindfulness Mistakes</h2>
          <ul>
            <li>
              Expecting instant results or "clearing the mind completely."
            </li>
            <li>Forcing practices instead of gently integrating them.</li>
            <li>Inconsistency and skipping reflection time.</li>
            <li>Ignoring the connection between body and mind.</li>
          </ul>

          <h2 className={classes.sectionTitle}>Additional Resources</h2>
          <p>
            Combine your mental practice with nourishing movement from our{" "}
            <Link href="/fitness">fitness section</Link> or healthy habits from
            the <Link href="/nourish">nourish section</Link>. Explore articles,
            guided audios, and breath techniques tailored for everyday stress
            and burnout.
          </p>

          <blockquote>
            <em>
              “Peace is not a place to get to — it’s a moment you create.”
            </em>
          </blockquote>
          <hr />
          {/* 🛒 Tools I Recommend */}
          {/* <section className={classes.toolsSection}>
            <h2 className={classes.sectionTitle}>Tools I Recommend</h2>
            <p>
              Enhance your mindfulness practice with quality tools I personally
              recommend — from journals to yoga essentials and calming teas.
            </p>

            <div className={classes.toolsGrid}>
              <Link
                href="https://www.amazon.com/dp/B09YHBVVWZ"
                target="_blank"
                className={classes.toolCard}
              >
                <span>📔</span>
                <h3>Mindfulness Journal</h3>
                <p>Track your thoughts, gratitude, and reflections each day.</p>
              </Link>

              <Link
                href="https://www.amazon.com/dp/B07ZVR2J8L"
                target="_blank"
                className={classes.toolCard}
              >
                <span>🧘‍♀️</span>
                <h3>Eco Yoga Mat</h3>
                <p>Non-slip, eco-friendly mat for daily yoga or meditation.</p>
              </Link>

              <Link
                href="https://www.iherb.com/pr/yogi-tea-calming/2020"
                target="_blank"
                className={classes.toolCard}
              >
                <span>🍵</span>
                <h3>Yogi Calming Tea</h3>
                <p>Relaxing herbal blend to support a peaceful mind.</p>
              </Link>
            </div>
          </section> */}
          <div className={classes.challengeHeader}>
            Start Your Mindfullness Journey
          </div>
          <ChallengeCard
            title="Unlock Calm in 21 Days"
            description="Discover daily micro-practices to ease your mind, reduce stress, and build lasting peace — in just a few mindful minutes each day."
            href="/challenges/21-days-mindfulness/1"
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

        {/* --- Category Sections --- */}
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

              <MindfulnessList items={category.items} />
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
      revalidate: 60,
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

export default MindfulnessPage;
