import MindfulnessItem from "./mindfulness-item";
import { gaEvent } from "../../lib/gtag";
import classes from "./mindfulness-list.module.css";
import { useEffect } from "react";

export default function MindfulnessList(props) {
  const { items } = props;

  if (!items) return <p>Loading...</p>;

  // LIST RENDER TRACKING
  useEffect(() => {
    gaEvent("mindfulness_list_render", { count: items.length });
    gaEvent("key_mindfulness_list_render", { count: items.length });
  }, [items]);

  return (
    <ul className={classes["mindfulness-list-container"]}>
      {items.map((item) => {
        // ITEM VIEW
        gaEvent("mindfulness_item_view", { id: item.id, title: item.title });
        gaEvent("key_mindfulness_item_view", { id: item.id, title: item.title });

        return (
          <MindfulnessItem
            key={item.id}
            id={item.id}
            title={item.title}
            summary={item.summary}
            intro={item.intro}
            image={item.image}
          />
        );
      })}
    </ul>
  );
}