import { useState, useEffect, useRef } from "react";
import fitnessData from "../../data/fitness.json";
import mindfulnessData from "../../data/mindfulness.json";
import nourishData from "../../data/nourish.json";
import FitnessItem from "../fitness/fitness-item";
import MindfulnessItem from "../mindfulness/mindfulness-item";
import NourishItem from "../nourish/nourish-item";
import classes from "./DailyList.module.css";

const allItems = [
  ...Object.values(fitnessData)
    .flat()
    .map((item) => ({ ...item, type: "fitness" })),
  ...Object.values(mindfulnessData)
    .flat()
    .map((item) => ({ ...item, type: "mindfulness" })),
  ...Object.values(nourishData)
    .flat()
    .map((item) => ({ ...item, type: "nourish" })),
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
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const shuffled = shuffle(allItems);
    setTodayItems(shuffled.slice(0, 50));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const cards = container?.querySelectorAll(`.${classes.cardWrapper}`);
    if (!container || !cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let maxVisibleEntry = null;
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            (!maxVisibleEntry ||
              entry.intersectionRatio > maxVisibleEntry.intersectionRatio)
          ) {
            maxVisibleEntry = entry;
          }
        }

        if (maxVisibleEntry) {
          const index = [...cards].indexOf(maxVisibleEntry.target);
          setActiveIndex(index);
        }
      },
      { root: container, threshold: 0.6 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [todayItems]);

  useEffect(() => {
    const dots = document.querySelectorAll(`.${classes.dot}`);
    dots.forEach((dot, i) =>
      dot.classList.toggle(classes.active, i === activeIndex)
    );
  }, [activeIndex]);

  const scrollCards = (dir) => {
    const container = containerRef.current;
    const card = container?.querySelector(`.${classes.cardWrapper}`);
    if (!container || !card) return;

    const scrollAmount = card.offsetWidth + 20;

    container.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (todayItems.length === 0) return null;

  const visibleDotCount = 7;
  const half = Math.floor(visibleDotCount / 2);
  const total = todayItems.length;
  const current = activeIndex;

  const getVisibleDots = () => {
    const maxDots = visibleDotCount;
    const total = todayItems.length;

    if (total <= maxDots) {
      return Array.from({ length: total }, (_, i) => i);
    }

    let start = activeIndex - Math.floor(maxDots / 2);
    let end = start + maxDots;

    if (start < 0) {
      start = 0;
      end = maxDots;
    }

    if (end > total) {
      end = total;
      start = Math.max(0, total - maxDots);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  return (
    <>
      <div className={`${classes.fadeEdges}`}>
        <div className={classes.dailyContainer} ref={containerRef}>
          {todayItems.map((item, index) => {
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

        <div className={classes.progressDots}>
          {getVisibleDots().map((i) => (
            <span
              key={i}
              className={`${classes.dot} ${
                i === activeIndex ? classes.active : ""
              }`}
            />
          ))}
        </div>

        <div className={classes.arrows}>
          <button
            onClick={() => scrollCards("left")}
            className={classes.arrowBtn}
          >
            ◀
          </button>
          <button
            onClick={() => scrollCards("right")}
            className={classes.arrowBtn}
          >
            ▶
          </button>
        </div>
      </div>
    </>
  );
}
