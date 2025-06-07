import React, { useState, useEffect, useRef } from "react";
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
  const dotRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);


  useEffect(() => {
    const shuffled = shuffle(allItems);
    setTodayItems(shuffled.slice(0, 100));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const cards = container?.querySelectorAll(`.${classes.cardWrapper}`);
    const dots = dotRefs.current;

    if (!container || !cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = [...cards].indexOf(entry.target);
          if (entry.isIntersecting && dots[index]) {
            setActiveIndex(index); // ✅ TRACK
            dots.forEach((dot, i) => {
              dot.classList.toggle(classes.active, i === index);
            });
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    cards.forEach((card) => observer.observe(card));

    // ✅ Autoplay Logic
    let index = 0;
    let autoplayStopped = false;

    const scrollToCard = (i) => {
      cards[i % cards.length]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    };

    const autoplay = setInterval(() => {
      if (!autoplayStopped) {
        index++;
        scrollToCard(index);
      }
    }, 5000); // every 5s

    const stopAutoplay = () => {
      autoplayStopped = true;
    };

    container.addEventListener("scroll", stopAutoplay, { once: true });

    return () => {
      observer.disconnect();
      clearInterval(autoplay);
      container.removeEventListener("scroll", stopAutoplay);
    };
  }, [todayItems]);

  const scrollCards = (dir) => {
    const container = containerRef.current;
    const card = container?.querySelector(`.${classes.cardWrapper}`);
    if (!container || !card) return;

    const scrollAmount = card.offsetWidth + 20;
    container.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    // ⛔ Stop autoplay on manual interaction
    container.dispatchEvent(new Event("scroll"));
  };

  if (todayItems.length === 0) return null;

  const visibleDotCount = 7;
  const half = Math.floor(visibleDotCount / 2);
  const total = todayItems.length;
  const current = activeIndex;

  const getVisibleDots = () => {
    let start = Math.max(0, current - half);
    let end = Math.min(total, start + visibleDotCount);
    if (end - start < visibleDotCount) {
      start = Math.max(0, end - visibleDotCount);
    }
    return [...Array(end - start)].map((_, i) => start + i);
  };

  return (
    <>
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
          ></span>
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
    </>
  );
}
