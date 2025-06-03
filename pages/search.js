import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

import fitness from "../data/fitness.json";
import mindfulness from "../data/mindfulness.json";
import nourish from "../data/nourish.json";

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
    <div style={{ padding: "2rem" }}>
      <h1>Search Results for: <em>{query}</em></h1>
      {["Fitness", "Mindfulness", "Nourish"].map((category) => {
        const items = results.filter((item) => item.type === category);
        return (
          <section key={category} style={{ marginBottom: "2rem" }}>
            <h2>{category}</h2>
            {items.length > 0 ? (
              <ul>
                {items.map((item, index) => (
                  <li key={index} style={{ marginBottom: "1rem" }}>
                    <Link href={`/${item.type.toLowerCase()}/${item.id}`} legacyBehavior>
                      <a><strong>{item.title}</strong></a>
                    </Link>
                    <p style={{ margin: "0.25rem 0" }}>{item.summary}</p>
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
