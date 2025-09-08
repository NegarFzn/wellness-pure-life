import classes from "./NourishHighlights.module.css";
import { Salad, Leaf, Apple, Smile } from "lucide-react";

export default function NourishHighlights() {
  const features = [
    {
      icon: <Salad size={28} />,
      title: "Balanced Meals",
      text: "Simple, nourishing recipes crafted for energy and wellness.",
    },
    {
      icon: <Leaf size={28} />,
      title: "Whole Foods Focus",
      text: "No gimmicks. Just real ingredients your body loves.",
    },
    {
      icon: <Apple size={28} />,
      title: "Sustainable Habits",
      text: "Easy-to-follow routines that work for your lifestyle.",
    },
    {
      icon: <Smile size={28} />,
      title: "Mood & Nutrition",
      text: "Understand how food impacts energy, focus, and mood.",
    },
  ];

  return (
    <section className={classes.featureSection} aria-label="Nourish Benefits">
      <div className={classes.container}>
        <h2 className={classes.title}>
          What Sets Our Nutrition Approach Apart?
        </h2>
        <div className={classes.grid}>
          {features.map((feature, index) => (
            <div className={classes.card} key={index}>
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
