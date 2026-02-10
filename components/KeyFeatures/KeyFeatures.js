import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gaEvent } from "../../lib/gtag";
import classes from "./KeyFeatures.module.css";

export default function KeyFeatures() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // -----------------------------------------------------
  // GA4 — Section Loaded + Anomaly Baseline
  // -----------------------------------------------------
  useEffect(() => {
    gaEvent("home_key_features_view");
    gaEvent("key_home_key_features_loaded", { items: 3 });
  }, []);

  // Scroll tracking (left / right)
  const scrollCards = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const card = container.querySelector(`.${classes.featureCard}`);
    if (!card) return;

    const scrollAmount = card.offsetWidth + 20;

    // GA4 → scroll trigger
    gaEvent("home_key_features_scroll", { direction });

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // -----------------------------------------------------
  // Intersection Observer → Track card impressions
  // -----------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    const cards = container?.querySelectorAll(`.${classes.featureCard}`);
    if (!cards || !cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = [...cards].indexOf(entry.target);

          if (entry.isIntersecting) {
            setActiveIndex(index);

            // View event
            gaEvent("home_key_features_card_view", {
              index,
              title: features[index].title,
            });

            // Anomaly key event
            gaEvent("key_home_feature_card_visible", {
              index,
              title: features[index].title,
            });
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      href: "/fitness",
      img: "/images/fitness.jpg",
      title: "Stronger Body",
      desc: "💪 Guided workouts and expert tips to help you move better, build strength, and feel your best.",
      color: "#f97316",
    },
    {
      href: "/mindfulness",
      img: "/images/mindfulness.jpg",
      title: "Calm Your Mind",
      desc: "🧘‍♀️ Reduce stress, improve focus, and create calm through simple mindfulness practices.",
      color: "#3b82f6",
    },
    {
      href: "/nourish",
      img: "/images/nourish.jpg",
      title: "Nourishment",
      desc: "🌿 Fuel up with balanced meals and superfoods that energize, heal, and uplift — naturally.",
      color: "#10b981",
    },
  ];

  return (
    <section className={classes.featuresSection}>
      <h2 className={classes.heading}>Guiding You to a Healthier Life</h2>
      <p className={classes.subheading}>
        Explore our core pillars of wellness — designed to help you thrive with
        balance in body, mind, and lifestyle.
      </p>

      <div className={classes.featureGrid} ref={containerRef}>
        {features.map((f, i) => (
          <Link
            href={f.href}
            className={classes.featureCard}
            key={i}
            onClick={() => {
              gaEvent("home_key_feature_click", {
                index: i,
                title: f.title,
                href: f.href,
              });

              // anomaly key event
              gaEvent("key_home_feature_clicked", {
                index: i,
                title: f.title,
              });
            }}
          >
            <div
              className={classes.imageWrapper}
              style={{ borderColor: f.color }}
            >
              <Image
                src={f.img}
                alt={`${f.title} – ${f.desc.replace(
                  /[\u{1F600}-\u{1F6FF}]/gu,
                  "",
                )}`}
                width={400}
                height={250}
                className={classes.image}
                priority
              />
            </div>
            <h3 style={{ color: f.color }}>{f.title}</h3>
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
