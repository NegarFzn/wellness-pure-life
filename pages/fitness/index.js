import fs from "fs/promises";
import path from "path";
import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import fitnessHeader from "./../../public/images/fitness_header.jpg";
import classes from "./index.module.css";
import FitnessList from "../../components/fitness/fitness-list";
import MultiStartQuiz from "../../components/Quiz/QuizPlan/1_StartQuiz.js";
import FitnessHighlights from "../../components/TopPages/FitnessHighlights.js";

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

  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id");
          const link = document.querySelector(`a[data-key="${id}"]`);
          if (entry.isIntersecting && link) {
            document
              .querySelectorAll(`.${classes.subnavLink}`)
              .forEach((el) => el.classList.remove(classes.active));
            link.classList.add(classes.active);
          }
        });
      },
      {
        threshold: 0.4, // adjust visibility trigger
      }
    );

    const sections = categories.map((c) => document.getElementById(c.key));
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [categories]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

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

        {/* Open Graph for Facebook & LinkedIn */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wellness Pure Life" />
        <meta
          property="og:title"
          content="Fitness | Workouts, Training Plans, and Recovery Guides"
        />
        <meta
          property="og:description"
          content="Explore personalized training programs, cardio routines, strength techniques, and yoga practices for a stronger, healthier you."
        />
        <meta
          property="og:image"
          content="https://wellnesspurelife.com/images/social-card.jpg"
        />
        <meta
          property="og:url"
          content="https://wellnesspurelife.com/fitness"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fitness | Wellness Pure Life" />
        <meta
          name="twitter:description"
          content="Train smarter with wellness-focused plans, workouts, and expert-backed guidance tailored to your level."
        />
        <meta
          name="twitter:image"
          content="https://wellnesspurelife.com/images/social-card.jpg"
        />

        {/* Canonical & Favicon */}
        <link rel="canonical" href="https://wellnesspurelife.com/fitness" />
        <link rel="icon" href="/favicon.ico" />

        {/* Structured Data: Breadcrumb JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
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
              },
            ]),
          }}
        />
      </Head>

      <header className={classes.header}>
        <nav>
          <Image
            src={fitnessHeader}
            alt="Banner showing fitness training, strength exercises, and yoga — Wellness Pure Life"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 100vw"
          />
        </nav>
      </header>

      <main className={classes["main-content"]}>
        <MultiStartQuiz slug="fitness-plan" />
        <FitnessHighlights />

        {/* Educational Overview */}
        <section className={classes.intro}>
          <h2 className={classes.sectionTitle}>
            Understand the Pillars of Fitness
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
                  .getElementById("cardio")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span>💓</span>
              <h3>Cardio</h3>
            </motion.div>

            <motion.div
              className={`${classes.card} ${classes.cardResistance}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onClick={() =>
                document
                  .getElementById("resistanceTraining")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span>💪</span>
              <h3>Resistance</h3>
            </motion.div>

            <motion.div
              className={`${classes.card} ${classes.cardRecovery}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() =>
                document
                  .getElementById("restAndRecovery")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span>🛌</span>
              <h3>Recovery</h3>
            </motion.div>

            <motion.div
              className={`${classes.card} ${classes.cardFlexibility}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={() =>
                document
                  .getElementById("yoga")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span>🧘</span>
              <h3>Flexibility</h3>
            </motion.div>
          </div>

          {/* Educational Guide */}
          <h2 className={classes.sectionTitle}>How to Get Started</h2>
          <p>
            Beginners should aim for <strong>2–3 full-body workouts</strong> per
            week, mixing strength and cardio. Intermediate and advanced trainees
            can cycle through progressive overload plans, rotating compound
            lifts, accessory work, and cardio intervals.{" "}
            <em>Remember: recovery is as important as training.</em>
          </p>

          <h2 className={classes.sectionTitle}>Common Fitness Mistakes</h2>
          <ul>
            <li>Skipping warm-ups and cool-downs.</li>
            <li>Overtraining without rest days.</li>
            <li>Neglecting nutrition and hydration.</li>
            <li>Focusing only on aesthetics instead of overall health.</li>
          </ul>

          <h2 className={classes.sectionTitle}>Additional Resources</h2>
          <p>
            Pair your workouts with proper{" "}
            <Link href="/nourish">nutrition</Link> and mental wellness practices
            from our <Link href="/mindfulness">mindfulness hub</Link>. Explore
            our article database below for step-by-step plans, form guides, and
            recovery strategies.
          </p>

          <blockquote>
            <em>
              “Consistency beats intensity. Show up, move daily, and progress
              will follow.”
            </em>
          </blockquote>
        </section>

        {/* CTA Section */}
        <section className={classes.ctaSection}>
          <h2>Ready to Begin?</h2>
          <p>
            Start with a beginner plan or take our quick quiz to get
            personalized recommendations.
          </p>
          <Link href="/start" className={classes.ctaButton}>
            Start Now
          </Link>
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

        {/* Category Sections */}
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
              <FitnessList items={category.items} />
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
