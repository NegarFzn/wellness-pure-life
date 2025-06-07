import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import classes from "./KeyFeatures.module.css";

export default function KeyFeatures() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollCards = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const card = container.querySelector(`.${classes.featureCard}`);
    if (!card) return;

    const scrollAmount = card.offsetWidth + 16;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    const cards = container.querySelectorAll(`.${classes.featureCard}`);
    const dots = document.querySelectorAll(`.${classes.dot}`);

    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = [...cards].indexOf(entry.target);
          if (entry.isIntersecting) {
            setActiveIndex(index);
            dots.forEach((dot, i) =>
              dot.classList.toggle(classes.active, i === index)
            );
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
    };
  }, []);

  const features = [
    {
      href: "/fitness",
      img: "/images/fitness.jpg",
      title: "Stronger Body",
      desc: "💪 Discover guided workouts and expert tips to help you move better, build lasting strength, and feel your best.",
    },
    {
      href: "/mindfulness",
      img: "/images/mindfulness.jpg",
      title: "Calm Your Mind",
      desc: "🧘‍♀️ Learn to reduce stress, improve focus, and create calm through simple mindfulness practices and breathing.",
    },
    {
      href: "/nourish",
      img: "/images/nourish.jpg",
      title: "Nourishment",
      desc: "🌿 Fuel up with balanced meals and superfoods that energize, heal, and uplift—naturally.",
    },
  ];

  return (
    <section className={classes.featuresSection}>
      <h2 className={classes.heading}>Guiding You to a Healthier Life</h2>

      <div className={classes.featureGrid} ref={containerRef}>
        {features.map((f, i) => (
          <Link href={f.href} className={classes.featureCard} key={i}>
            <Image
              src={f.img}
              alt={f.title}
              width={200}
              height={150}
              className={classes.icon}
              priority
            />
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </Link>
        ))}
      </div>

      <div className={classes.progressDots}>
        {features.map((_, i) => (
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
    </section>
  );
}
