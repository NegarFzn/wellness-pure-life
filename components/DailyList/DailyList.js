import { useState, useEffect, useRef } from "react";
import { gaEvent } from "../../lib/gtag";
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

  // 🔥 INITIAL VIEW EVENT + KEY EVENT
  useEffect(() => {
    gaEvent("daily_list_view");
    gaEvent("key_daily_list_view");
  }, []);

  // LOAD RANDOM ITEMS
  useEffect(() => {
    const shuffled = shuffle(allItems);
    setTodayItems(shuffled.slice(0, 50));
  }, []);

  // OBSERVER FOR VIEWED CARDS
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

          // 🔥 CARD VIEW TRACKING + KEY EVENT
          gaEvent("daily_list_card_view", {
            index,
            type: todayItems[index]?.type,
            title: todayItems[index]?.title,
          });

          gaEvent("key_daily_list_card_view", {
            index,
            type: todayItems[index]?.type,
            title: todayItems[index]?.title,
          });
        }
      },
      { root: container, threshold: 0.6 },
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [todayItems]);

  // ACTIVE DOTS
  useEffect(() => {
    const dots = document.querySelectorAll(`.${classes.dot}`);
    dots.forEach((dot, i) =>
      dot.classList.toggle(classes.active, i === activeIndex),
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
              <div
                className={classes.cardWrapper}
                key={item.id}
                onClick={() => {
                  // 🔥 ITEM CLICK + KEY EVENT
                  gaEvent("daily_list_item_click", {
                    id: item.id,
                    type: item.type,
                    title: item.title,
                  });

                  gaEvent("key_daily_list_item_click", {
                    id: item.id,
                    type: item.type,
                    title: item.title,
                  });
                }}
              >
                <Component {...item} />
              </div>
            );
          })}
        </div>

        {/* DOTS */}
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

        {/* ARROWS */}
        <div className={classes.arrows}>
          <button
            onClick={() => {
              gaEvent("daily_list_arrow_click", { direction: "left" });
              gaEvent("key_daily_list_arrow_click", { direction: "left" });
              scrollCards("left");
            }}
            className={classes.arrowBtn}
          >
            ◀
          </button>

          <button
            onClick={() => {
              gaEvent("daily_list_arrow_click", { direction: "right" });
              gaEvent("key_daily_list_arrow_click", { direction: "right" });
              scrollCards("right");
            }}
            className={classes.arrowBtn}
          >
            ▶
          </button>
        </div>
      </div>
    </>
  );
}
