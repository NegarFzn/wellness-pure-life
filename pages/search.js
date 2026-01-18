import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { motion } from "framer-motion";
import { gaEvent } from "../lib/gtag";
import fitness from "../data/fitness.json";
import mindfulness from "../data/mindfulness.json";
import nourish from "../data/nourish.json";
import classes from "./search.module.css";

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestion, setSuggestion] = useState("");

  useEffect(() => {
    if (q) {
      gaEvent("search_page_view", { query: q });
    }
  }, [q]);

  const allTitles = [
    ...Object.values(fitness)
      .flat()
      .map((item) => item.title),
    ...Object.values(mindfulness)
      .flat()
      .map((item) => item.title),
    ...Object.values(nourish)
      .flat()
      .map((item) => item.title),
  ];

  const fuse = new Fuse(allTitles, {
    includeScore: true,
    threshold: 0.4,
  });

  useEffect(() => {
    if (!q) return;

    setQuery(q);
    const term = q.toLowerCase();
    const matched = [];

    const suggested = fuse.search(term);
    if (suggested.length > 0) {
      setSuggestion(suggested[0].item);
    }

    const collections = [
      { label: "Fitness", data: Object.values(fitness).flat() },
      { label: "Mindfulness", data: Object.values(mindfulness).flat() },
      { label: "Nourish", data: Object.values(nourish).flat() },
    ];

    collections.forEach(({ label, data }) => {
      data.forEach((item) => {
        if (
          item.title?.toLowerCase().includes(term) ||
          item.summary?.toLowerCase().includes(term)
        ) {
          matched.push({ ...item, type: label });
        }
      });
    });

    setResults(matched);
  }, [q]);

  return (
    <>
      <Head>
        <title>Search Results – Wellness Pure Life</title>
        <meta
          name="description"
          content="Find personalized fitness, mindfulness, and nutrition content tailored to your search at Wellness Pure Life."
        />
        <meta
          property="og:title"
          content="Search Results – Wellness Pure Life"
        />
        <meta
          property="og:description"
          content="Find personalized fitness, mindfulness, and nutrition content tailored to your search at Wellness Pure Life."
        />
        <meta
          property="og:image"
          content="https://wellnesspurelife.com/images/social-card.jpg"
        />
        <meta property="og:url" content="https://wellnesspurelife.com/search" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/logo.png" />
        <link rel="canonical" href="https://wellnesspurelife.com/search" />
      </Head>{" "}
      <div className={classes.pageWrapper}>
        {/* Left Side: Main Content */}
        <div className={classes.contentArea}>
          <div className={classes.container}>
            <h1>
              Search Results for:{" "}
              <span className={classes.emphasized}>{query}</span>
            </h1>

            {suggestion && suggestion.toLowerCase() !== query.toLowerCase() && (
              <motion.div
                className={classes.suggestionContainer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <svg
                  className={classes.suggestionIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-7.5 4h9a2.5 2.5 0 002.5-2.5v-13a2.5 2.5 0 00-2.5-2.5h-9A2.5 2.5 0 005 4.5v13A2.5 2.5 0 007.5 20z"
                  />
                </svg>
                <p className={classes.suggestionText}>
                  Did you mean:{" "}
                  <Link
                    href={`/search?q=${encodeURIComponent(suggestion)}`}
                    onClick={() =>
                      gaEvent("search_suggestion_click", {
                        original_query: query,
                        suggestion,
                      })
                    }
                    className={classes.suggestionLink}
                  >
                    {suggestion}
                  </Link>
                  ?
                </p>
              </motion.div>
            )}

            {["Fitness", "Mindfulness", "Nourish"]
              .map((category) => {
                const items = results.filter((item) => item.type === category);
                return { category, items };
              })
              .sort((a, b) => b.items.length - a.items.length) // 🎯 categories with results first
              .map(({ category, items }) => (
                <section key={category} className={classes.section}>
                  <h2 className={classes.categoryHeader}>
                    {category}
                    <span className={classes.resultCount}>
                      ({items.length} result{items.length !== 1 ? "s" : ""})
                    </span>
                  </h2>

                  {items.length > 0 ? (
                    <ul className={classes.resultItemList}>
                      {items.map((item, index) => (
                        <li key={index} className={classes.resultItem}>
                          <Link
                            href={`/${item.type.toLowerCase()}/${item.id}`}
                            legacyBehavior
                          >
                            <a>
                              <strong>{item.title}</strong>
                            </a>
                          </Link>
                          <p className={classes.title}>{item.summary}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={classes.noMatch}>
                      <svg
                        className={classes.noMatchIcon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405M15 17l-4-4m0 0L5.405 7.405M11 13l-4-4"
                        />
                      </svg>
                      No results found. Try a different keyword or check your
                      spelling.
                    </p>
                  )}
                </section>
              ))}
          </div>
        </div>

        {/* Right Side: Google Ad */}
        {/* <AdSidebar adSlots={["1234567890", "2345678901", "3456789012"]} /> */}
      </div>
    </>
  );
}
