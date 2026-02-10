import { useEffect } from "react";
import NourishItem from "./nourish-item";
import { gaEvent } from "../../lib/gtag";
import classes from "./nourish-list.module.css";

export default function NourishList(props) {
  const { items } = props;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return <p>Loading...</p>;
  }

  // fire analytics when list loads
  useEffect(() => {
    items.forEach((item) => {
      gaEvent("nourish_list_item_view", {
        id: item.id,
        title: item.title,
      });

      gaEvent("key_nourish_list_item_view", {
        id: item.id,
        title: item.title,
      });
    });
  }, [items]);

  return (
    <ul className={classes["nourish-list-container"]}>
      {items.map((item) => (
        <NourishItem
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
