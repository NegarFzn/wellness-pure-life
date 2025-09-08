// components/HeroStartQuiz/HeroStartQuizNourish.jsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import classes from "./NourishStartQuiz.module.css"; // Reuse or duplicate if needed

export default function NourishStartQuiz() {
  const router = useRouter();
  const [goal, setGoal] = useState(null);

  const goals = {
    eat_healthier: { label: "Eat Healthier", emoji: "🥗" },
    weight_management: { label: "Weight Management", emoji: "⚖️" },
    energy_focus: { label: "More Energy & Focus", emoji: "⚡" },
    gut_health: { label: "Improve Gut Health", emoji: "🦠" },
  };

  const progress = goal ? 20 : 0;

  function handleStart() {
    const query = goal ? `?goal=${goal}` : "";
    router.push(`/quiz${query}`);
  }

  return (
    <section
      className={classes.heroSection}
      aria-label="Start Your Nutrition Quiz"
    >
      <div className={classes.heroContent}>
        <div className={classes.textBlock}>
          <h1 className={classes.heading}>
            Nourish Your <span className={classes.highlight}>Body</span> & Mind
            <span className={classes.subHeading}>
              Start Your Nutrition Journey
            </span>
          </h1>

          <p className={classes.subText}>
            Take a quick quiz to get a{" "}
            <span className={classes.bold}>personalized nutrition plan</span>{" "}
            tailored to your needs.
          </p>

          <div
            className={classes.progressWrapper}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div className={classes.progressBar}>
              <div
                className={classes.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className={classes.quizWrapper}>
            <label htmlFor="goal-options" className={classes.quizLabel}>
              What’s your main goal?
            </label>
            <div
              id="goal-options"
              className={classes.goalOptions}
              role="radiogroup"
            >
              {Object.keys(goals).map((k) => {
                const active = goal === k;
                return (
                  <button
                    key={k}
                    onClick={() => setGoal(k)}
                    className={`${classes.goalButton} ${
                      active ? classes.activeGoal : ""
                    }`}
                    aria-pressed={active}
                    aria-checked={active}
                    role="radio"
                  >
                    <span aria-hidden="true">{goals[k].emoji}</span>
                    <span className={classes.goalText}>{goals[k].label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {goal && (
            <div className={classes.selectionNote}>
              You selected: {goals[goal].label}. You're on the right track!
            </div>
          )}

          <div className={classes.ctaWrapper}>
            <button
              onClick={handleStart}
              className={classes.primaryCta}
              disabled={!goal}
            >
              {goal ? "Continue – Get My Plan →" : "Start the Quiz – It’s Free"}
            </button>

            <a
              href="/nutrition-guides"
              className={classes.secondaryCta}
              aria-label="Explore free nutrition tips"
            >
              Explore Free Tips & Recipes
            </a>
          </div>

          <div className={classes.socialProof}>
            ⭐️⭐️⭐️⭐️⭐️ Trusted by 10,000+ on their healthy eating journey
          </div>
        </div>

        <div className={classes.mockupWrapper} aria-hidden="true">
          <div className={classes.mockup}>
            <div className={classes.mockHeader} />
            <div className={classes.mockContent}>
              <div className={classes.mockLine} />
              <div className={classes.mockLineShort} />
              <div className={classes.mockGrid}>
                <div className={classes.mockCard} />
                <div className={classes.mockCard} />
                <div className={classes.mockCard} />
                <div className={classes.mockCard} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
