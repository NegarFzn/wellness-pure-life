"use client";

import classes from "./FitnessHighlights.module.css";
import { Sparkles, Dumbbell, Salad, Brain } from "lucide-react";
import { gaEvent } from "../../lib/gtag";
import { useEffect } from "react";

const featureIcons = {
  Sparkles,
  Dumbbell,
  Salad,
  Brain,
};

const features = [
  {
    icon: "Sparkles",
    title: "Personalized Plans",
    text: "Tailored fitness and wellness plans based on your goals and lifestyle.",
  },
  {
    icon: "Dumbbell",
    title: "Build Muscle or Burn Fat",
    text: "Science-based routines that adapt as you progress.",
  },
  {
    icon: "Salad",
    title: "Nutrition Guidance",
    text: "Simple, realistic meal advice with no fad diets.",
  },
  {
    icon: "Brain",
    title: "Mental Wellness",
    text: "Mindfulness and mood tracking to keep you balanced.",
  },
];

export default function FeatureHighlights() {

  // VIEW IMPRESSION EVENT
  useEffect(() => {
    gaEvent("fitness_highlights_view");
    gaEvent("key_fitness_highlights_view");
  }, []);

  const handleClick = (feature, index) => {
    gaEvent("fitness_highlight_click", {
      feature_title: feature.title,
      feature_index: index,
    });
    gaEvent("key_fitness_highlight_click", {
      feature_title: feature.title,
      feature_index: index,
    });
  };

  return (
    <section className={classes.featureSection} aria-label="Platform Benefits">
      <div className={classes.container}>
        <h2 className={classes.title}>
          What Makes WellnessPureLife Different?
        </h2>
        <div className={classes.grid}>
          {features.map((feature, index) => {
            const IconComponent = featureIcons[feature.icon];
            return (
              <div
                className={classes.card}
                key={index}
                onClick={() => handleClick(feature, index)}
              >
                <div className={classes.icon}>
                  <IconComponent size={28} />
                </div>
                <h3 className={classes.cardTitle}>{feature.title}</h3>
                <p className={classes.cardText}>{feature.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
