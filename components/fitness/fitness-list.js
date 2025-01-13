import FitnessItem from "./fitness-item";
import classes from "./fitness-list.module.css";

export default function FitnessList(props) {
  const { items } = props;
  if (!items) {
    return <p>Loading...</p>;
  }

  return (
    <ul className={classes["fitness-list-container"]}>
      {items.map((item) => (
        <FitnessItem
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
