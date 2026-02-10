import MindfulnessItem from "./mindfulness-item";
import { gaEvent } from "../../lib/gtag";
import classes from "./mindfulness-list.module.css";
import Link from "next/link";

export default function MindfulnessList(props) {
  const { items } = props;
  if (!items) return <p>Loading...</p>;

  // LIST RENDER TRACKING
  gaEvent("mindfulness_list_render", { count: items.length });
  gaEvent("key_mindfulness_list_render", { count: items.length });

  return (
    <ul className={classes["mindfulness-list-container"]}>
      {items.map((item) => {
        // ITEM VIEW (fires immediately on render)
        gaEvent("mindfulness_item_view", { id: item.id, title: item.title });
        gaEvent("key_mindfulness_item_view", { id: item.id, title: item.title });

        return (
          <li key={item.id}>
            <Link
              href={`/mindfulness/${item.id}`}
              onClick={() => {
                gaEvent("mindfulness_item_click", {
                  id: item.id,
                  title: item.title,
                });
                gaEvent("key_mindfulness_item_click", {
                  id: item.id,
                  title: item.title,
                });
              }}
            >
              <MindfulnessItem
                id={item.id}
                title={item.title}
                summary={item.summary}
                intro={item.intro}
                image={item.image}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
