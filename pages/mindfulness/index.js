import path from "path";
import fs from "fs/promises";
import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import mindfulnessHeader from "./../../public/images/mindfulness_header.jpg";
import classes from "./index.module.css";
import MindfulnessList from "../../components/mindfulness/mindfulness-list";

function MindfulnessPage(props) {
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
            alt="Calm scene for meditation and breathing — WellnessPureLife Mindfulness"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 100vw"
          />
        </nav>
      </header>

      <main className={classes["main-content"]}>
        {/* --- SEO Intro Block (human-written) --- */}
        <section className={classes.intro}>
          <h1 className={classes["left-align"]}>
            Mindfulness that Fits Real Life
          </h1>
          <p>
            Mindfulness isn’t about emptying your mind—it’s about paying kind,
            steady attention to what’s here now. In this hub you’ll find short,
            repeatable practices you can use before a big meeting, after a
            stressful commute, or when you simply want to reset. Every guide
            includes exact steps, common mistakes to avoid, and gentle
            progressions so you can build a habit without overwhelm.
          </p>
          <p>
            New to meditation? Start with a five‑minute{" "}
            <strong>breathing practice</strong> and add time as it feels right.
            If focus is your goal, try our <strong>productivity & focus</strong>{" "}
            routines designed to clear mental clutter in just a few minutes. For
            emotional balance, explore <strong>stress reduction</strong> and{" "}
            <strong>mental wellness</strong> articles packed with grounding
            techniques you can use at home or at work.
          </p>
          <p>
            Mind and body support each other: pairing mindfulness with movement
            and nutrition speeds recovery and improves energy. Visit our{" "}
            <Link href="/fitness"> fitness </Link> and{" "}
            <Link href="/nourish"> nutrition </Link> hubs to round out your
            routine. When you’re ready, dive into a feature from below or save a
            quick practice to your bookmarks so it’s there when you need it.
          </p>
          <details className={classes.faq}>
            <summary>
              FAQs: How long should I meditate? What if my mind wanders?
            </summary>
            <div>
              <p>
                Start with 3–5 minutes and add 1–2 minutes each week. Wandering
                is normal—when you notice it, gently return to the breath or
                your chosen anchor without judgment. If you feel anxious, open
                your eyes, lower the intensity, or switch to a grounding
                exercise like naming five things you can see.
              </p>
            </div>
          </details>
        </section>

        {/* Sticky sub-nav */}
        <nav className={classes.subnav} aria-label="Section navigation">
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
              <div className={classes["mindfulness-container"]}>
                <MindfulnessList items={category.items} />
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
