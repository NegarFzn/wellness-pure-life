import { useEffect } from "react";
import FitnessItem from "./fitness-item";
import { gaEvent } from "../../lib/gtag";
import classes from "./fitness-list.module.css";

export default function FitnessList({ items }) {
  // ---------------------------------------------
  // GA4: Track when the fitness list is displayed
  // ---------------------------------------------
  useEffect(() => {
    if (!items || items.length === 0) return;

    // Normal analytics
    gaEvent("fitness_list_view", {
      total_items: items.length,
    });

    // Anomaly detection
    gaEvent("key_fitness_list_loaded", {
      count: items.length,
    });
  }, [items]);

  if (!items) return <p>Loading...</p>;

  return (
    <ul className={classes["fitness-list-container"]}>
      {items.map((item) => (
        <FitnessItem
          key={item.id}
          id={item.id}
          title={item.title}
          summary={item.summary}
          intro={item.intro}
          image={item.image}
        />
      ))}
    </ul>
  );
}
