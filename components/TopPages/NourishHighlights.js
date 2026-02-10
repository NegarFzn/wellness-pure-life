"use client";

import { useEffect } from "react";
import classes from "./NourishHighlights.module.css";
import { gaEvent } from "../../lib/gtag";
import { Salad, Leaf, Apple, Smile } from "lucide-react";

export default function NourishHighlights() {
  const features = [
    {
      id: "balanced_meals",
      icon: <Salad size={28} />,
      title: "Balanced Meals",
      text: "Simple, nourishing recipes crafted for energy and wellness.",
    },
    {
      id: "whole_foods",
      icon: <Leaf size={28} />,
      title: "Whole Foods Focus",
      text: "No gimmicks. Just real ingredients your body loves.",
    },
    {
      id: "sustainable_habits",
      icon: <Apple size={28} />,
      title: "Sustainable Habits",
      text: "Easy-to-follow routines that work for your lifestyle.",
    },
    {
      id: "mood_nutrition",
      icon: <Smile size={28} />,
      title: "Mood & Nutrition",
      text: "Understand how food impacts energy, focus, and mood.",
    },
  ];

  // ---- MAIN VIEW EVENT ----
  useEffect(() => {
    gaEvent("nourish_highlights_view");
    gaEvent("key_nourish_highlights_view");
  }, []);

  // ---- CARD IMPRESSIONS ----
  useEffect(() => {
    features.forEach((feature) => {
      gaEvent("nourish_highlight_card_view", { id: feature.id });
      gaEvent("key_nourish_highlight_card_view", { id: feature.id });
    });

    // ---- ANOMALY: LOW ENGAGEMENT (FAKE VERSION UNTIL SCROLL INSTALLED) ----
    setTimeout(() => {
      gaEvent("anomaly_low_engagement_nourish_highlights");
      gaEvent("key_anomaly_low_engagement_nourish_highlights");
    }, 3000);
  }, []);

  return (
    <section className={classes.featureSection} aria-label="Nourish Benefits">
      <div className={classes.container}>
        <h2 className={classes.title}>
          What Sets Our Nutrition Approach Apart?
        </h2>
        <div className={classes.grid}>
          {features.map((feature) => (
            <div
              className={classes.card}
              key={feature.id}
              onClick={() => {
                gaEvent("nourish_highlight_card_click", { id: feature.id });
                gaEvent("key_nourish_highlight_card_click", { id: feature.id });
              }}
            >
              <div className={classes.icon}>{feature.icon}</div>
              <h3 className={classes.cardTitle}>{feature.title}</h3>
              <p className={classes.cardText}>{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
