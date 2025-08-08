import NourishItem from "./nourish-item";
import classes from "./nourish-list.module.css";

export default function NourishList(props) {
  const { items } = props;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <ul className={classes["nourish-list-container"]}>
      {items.map((item) => (
        <NourishItem
          key={item.id}
          id={item.id}
          title={item.title}
          summary={item.summary}
          intro={item.intro}   // ✅ pass intro as fallback (consistent with others)
          image={item.image}
        />
      ))}
    </ul>
  );
}
