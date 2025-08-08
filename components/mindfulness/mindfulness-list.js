import MindfulnessItem from "./mindfulness-item";
import classes from "./mindfulness-list.module.css";

export default function MindfulnessList(props) {
  const { items } = props;
  if (!items) return <p>Loading...</p>;

  return (
    <ul className={classes["mindfulness-list-container"]}>
      {items.map((item) => (
        <MindfulnessItem
          key={item.id}
          id={item.id}
          title={item.title}
          summary={item.summary}
          intro={item.intro} // ✅ pass intro as fallback (matches Fitness)
          image={item.image}
        />
      ))}
    </ul>
  );
}
