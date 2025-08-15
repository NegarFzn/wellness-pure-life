import path from "path";
import fs from "fs/promises";
import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import fitnessHeader from "./../../public/images/fitness_header.jpg";
import classes from "./index.module.css";
import FitnessList from "../../components/fitness/fitness-list";

function FitnessPage(props) {
  const [showButton, setShowButton] = useState(false);

  const categories = [
    { key: "featured", title: "FEATURED", items: props.featured },
    { key: "cardio", title: "CARDIO", items: props.cardio },
    {
      key: "resistanceTraining",
      title: "RESISTANCE TRAINING",
      items: props.resistanceTraining,
    },
    {
      key: "restAndRecovery",
      title: "REST AND RECOVERY",
      items: props.restAndRecovery,
    },
    { key: "yoga", title: "YOGA", items: props.yoga },
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

  // JSON‑LD (Breadcrumb + ItemList)
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
        name: "Fitness",
        item: "https://wellnesspurelife.com/fitness",
      },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: (props.featured || []).map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `https://wellnesspurelife.com/fitness/${it.id}`,
      name: it.title,
    })),
  };

  return (
    <>
      <Head>
        <title>Fitness | Workouts, Training Plans, and Recovery Guides</title>
        <meta
          name="description"
          content="Build strength, improve cardio, and recover smarter. Expert-backed workouts, step-by-step technique guides, and practical tips for all fitness levels."
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
            src={fitnessHeader}
            alt="People training with dumbbells and doing yoga — WellnessPureLife Fitness"
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
            Welcome to the WellnessPureLife Fitness Hub
          </h1>
          <p>
            This is your home base for moving better, getting stronger, and
            feeling more energetic—no fluff, no gimmicks. Our guides are written
            in clear language and grounded in practical coaching so you know
            exactly what to do, how to do it safely, and how to scale each
            movement for your level. Whether you’re picking up weights for the
            first time, returning after a break, or chasing a new PR, you’ll
            find step‑by‑step technique cues, set and rep schemes, and
            programming ideas you can apply today.
          </p>
          <p>
            Start with <strong>Resistance Training</strong> to build strength
            and muscle, explore <strong>Cardio</strong> for heart health and
            endurance, and don’t skip <strong>Rest &amp; Recovery</strong>
            —that’s where progress actually locks in. Prefer a calmer pace? Our{" "}
            <strong>Yoga</strong> section blends mobility, balance, and breath
            so your body feels good outside the gym too. Every article includes
            coaching cues, common mistakes to avoid, safety notes, and simple
            progressions so you can move forward with confidence.
          </p>
          <p>
            To support your training, pair these plans with smart nutrition and
            stress management. Check out our
            <Link href="/nourish"> nutrition </Link>
            and
            <Link href="/mindfulness"> mindfulness </Link>
            hubs for meal ideas, recovery snacks, and quick mental resets you
            can do in minutes. When you’re ready, dive into a feature like{" "}
            <Link href="/fitness/workouts-for-sculpting-every-inch-of-your-body">
              Workouts for Sculpting
            </Link>
            , or browse the categories below to find the right place to start.
          </p>
          <details className={classes.faq}>
            <summary>FAQs: How should I use these plans?</summary>
            <div>
              <p>
                Beginners: train two to three days per week, leave one to two
                reps in reserve, and focus on consistent form. Intermediate
                lifters: rotate compounds and accessories, and match recovery
                (sleep, protein, deload weeks) to your workload. If something
                hurts, stop and modify; consult a qualified professional as
                needed.
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
              <div className={classes["fitness-container"]}>
                <FitnessList items={category.items} />
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
    const filePath = path.join(process.cwd(), "data", "fitness.json");
    const jsonData = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(jsonData);

    if (!data || typeof data !== "object") {
      throw new Error("Invalid or missing fitness.json data.");
    }

    return {
      props: {
        featured: data.featured || [],
        resistanceTraining: data.resistanceTraining || [],
        yoga: data.yoga || [],
        restAndRecovery: data.restAndRecovery || [],
        cardio: data.cardio || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("❌ Error fetching fitness data:", error.message);
    return {
      props: {
        featured: [],
        resistanceTraining: [],
        yoga: [],
        restAndRecovery: [],
        cardio: [],
      },
    };
  }
}

export default FitnessPage;
