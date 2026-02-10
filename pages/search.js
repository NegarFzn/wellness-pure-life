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
      gaEvent("key_search_page_view", { query: q });
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

      gaEvent("search_suggestion_view", {
        query: q,
        suggestion: suggested[0].item,
      });
      gaEvent("key_search_suggestion_view", {
        query: q,
        suggestion: suggested[0].item,
      });
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
      </Head>

      <div className={classes.pageWrapper}>
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
                <p className={classes.suggestionText}>
                  Did you mean:{" "}
                  <Link
                    href={`/search?q=${encodeURIComponent(suggestion)}`}
                    onClick={() => {
                      gaEvent("search_suggestion_click", {
                        original_query: query,
                        suggestion,
                      });
                      gaEvent("key_search_suggestion_click", {
                        original_query: query,
                        suggestion,
                      });
                    }}
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
              .sort((a, b) => b.items.length - a.items.length) &&
              gaEvent("search_sort_applied", { type: "results_first" }) &&
              gaEvent("key_search_sort_applied", { type: "results_first" }) &&
              ["Fitness", "Mindfulness", "Nourish"]
                .map((category) => {
                  const items = results.filter(
                    (item) => item.type === category,
                  );
                  return { category, items };
                })
                .sort((a, b) => b.items.length - a.items.length)
                .map(({ category, items }) => (
                  <section
                    key={category}
                    className={classes.section}
                    onMouseEnter={() => {
                      gaEvent("search_category_view", {
                        category,
                        count: items.length,
                      });
                      gaEvent("key_search_category_view", {
                        category,
                        count: items.length,
                      });
                    }}
                  >
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
                              <a
                                onClick={() => {
                                  gaEvent("search_result_click", {
                                    category: item.type,
                                    id: item.id,
                                    title: item.title,
                                  });
                                  gaEvent("key_search_result_click", {
                                    category: item.type,
                                    id: item.id,
                                    title: item.title,
                                  });
                                }}
                              >
                                <strong>{item.title}</strong>
                              </a>
                            </Link>
                            <p className={classes.title}>{item.summary}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p
                        className={classes.noMatch}
                        onMouseEnter={() => {
                          gaEvent("search_no_results_view", { query });
                          gaEvent("key_search_no_results_view", { query });
                        }}
                      >
                        No results found. Try a different keyword.
                      </p>
                    )}
                  </section>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
