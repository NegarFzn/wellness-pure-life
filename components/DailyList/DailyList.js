import React, { useMemo } from "react";
import FitnessItem from "../fitness/fitness-item";
import MindfulnessItem from "../mindfulness/mindfulness-item";
import NourishItem from "../nourish/nourish-item";
import fitnessData from "../../data/fitness.json";
import mindfulnessData from "../../data/mindfulness.json";
import nourishData from "../../data/nourish.json";

const DailyList = () => {
  const dailyItems = useMemo(() => {
    const seed = new Date().toDateString();
    const seededRandom = (seed) => {
      let h = 0;
      for (let i = 0; i < seed.length; i++) {
        h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
      }
      return () => {
        h ^= h << 13;
        h ^= h >>> 17;
        h ^= h << 5;
        return (h >>> 0) / 4294967296;
      };
    };

    const random = seededRandom(seed);
    const allItems = [
      ...Object.values(fitnessData).flat(),
      ...Object.values(mindfulnessData).flat(),
      ...Object.values(nourishData).flat(),
    ];

    const shuffled = [...allItems].sort(() => random() - 0.5);
    return shuffled.slice(0, 2);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        flexWrap: "wrap",
        marginTop: "2rem",
      }}
    >
      {dailyItems.map((item) => {
        const Component =
          item.category === "fitness"
            ? FitnessItem
            : item.category === "mindfulness"
            ? MindfulnessItem
            : NourishItem;
        return <Component key={item.id} {...item} />;
      })}
    </div>
  );
};

export default DailyList;
