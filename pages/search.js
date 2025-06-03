import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import fitness from "../data/fitness.json";
import mindfulness from "../data/mindfulness.json";
import nourish from "../data/nourish.json";
import classes from "./search.module.css";

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!q) return;
    setQuery(q);

    const term = q.toLowerCase();
    const matched = [];

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
    <div className={classes.container}>
      <h1>
        Search Results for: <span className={classes.emphasized}>{query}</span>
      </h1>
      {["Fitness", "Mindfulness", "Nourish"].map((category) => {
        const items = results.filter((item) => item.type === category);
        return (
          <section key={category} className={classes.section}>
            <h2>{category}</h2>
            {items.length > 0 ? (
              <ul>
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
              <p>No matches in {category}.</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
