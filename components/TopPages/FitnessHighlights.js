import classes from "./FitnessHighlights.module.css";
import { Sparkles, Dumbbell, Salad, Brain } from "lucide-react";

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
              <div className={classes.card} key={index}>
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
