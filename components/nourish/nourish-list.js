import NourishItem from "./nourish-item";
import classes from "./nourish-list.module.css";

export default function NourishList(props) {
  const { items } = props;
  if (!items) {
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
          image={item.image}
        />
      ))}
    </ul>
  );
}
