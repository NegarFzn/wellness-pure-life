import React from "react";
import fitnessData from "../../data/fitness.json";
import mindfulnessData from "../../data/mindfulness.json";
import nourishData from "../../data/nourish.json";
import FitnessItem from "../fitness/fitness-item";
import MindfulnessItem from "../mindfulness/mindfulness-item";
import NourishItem from "../nourish/nourish-item";
import classes from "./DailyList.module.css";

const allItems = [
  ...Object.values(fitnessData).flat().map((item) => ({ ...item, type: "fitness" })),
  ...Object.values(mindfulnessData).flat().map((item) => ({ ...item, type: "mindfulness" })),
  ...Object.values(nourishData).flat().map((item) => ({ ...item, type: "nourish" }))
];

const getTodayItems = () => {
  const seed = new Date().toDateString();
  const hash = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shuffled = [...allItems].sort(() => 0.5 - (hash % 5) / 5);
  return shuffled.slice(0, 2);
};

export default function DailyList() {
  const todayItems = getTodayItems();

  return (
    <div className={classes.dailyContainer}>
      {todayItems.map((item) => {
        const Component =
          item.type === "fitness"
            ? FitnessItem
            : item.type === "mindfulness"
            ? MindfulnessItem
            : NourishItem;
        return (
          <div className={classes.cardWrapper} key={item.id}>
            <Component {...item} />
          </div>
        );
      })}
    </div>
  );
} 
