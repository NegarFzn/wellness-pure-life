import classes from "./MindfulnessHighlights.module.css";
import { Brain, Moon, Wind, Smartphone } from "lucide-react";

export default function MindfulnessHighlights() {
  const features = [
    {
      icon: <Brain size={28} />,
      title: "Meditation Routines",
      text: "Daily guided meditations to reduce anxiety and improve clarity.",
    },
    {
      icon: <Wind size={28} />,
      title: "Mood Tracking",
      text: "Track emotional patterns and improve self-awareness over time.",
    },
    {
      icon: <Moon size={28} />,
      title: "Sleep Support",
      text: "Tips and routines to help you fall asleep faster and rest deeper.",
    },
    {
      icon: <Smartphone size={28} />,
      title: "Digital Detox Tips",
      text: "Balance screen time and reclaim calm in your daily life.",
    },
  ];

  return (
    <section
      className={classes.featureSection}
      aria-label="Mindfulness Benefits"
    >
      <div className={classes.container}>
        <h2 className={classes.title}>What You'll Gain Through Mindfulness</h2>
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
