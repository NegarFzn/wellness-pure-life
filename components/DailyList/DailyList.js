import React from "react";
import { useState, useEffect } from "react";
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
  
  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  
  export default function DailyList() {
    const [todayItems, setTodayItems] = useState([]);
  
    useEffect(() => {
      const shuffled = shuffle(allItems);
      setTodayItems(shuffled.slice(0, 2));
    }, []);
  
    // Optional: loading fallback to prevent flashing
    if (todayItems.length === 0) return null;
  
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
