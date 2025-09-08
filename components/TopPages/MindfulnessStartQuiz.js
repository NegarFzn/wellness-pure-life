// components/HeroStartQuiz/HeroStartQuizMindfulness.jsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import classes from "./MindfulnessStartQuiz.module.css"; // You can create a separate CSS module if needed

export default function HeroStartQuizMindfulness() {
  const router = useRouter();
  const [goal, setGoal] = useState(null);

  const goals = {
    reduce_stress: { label: "Reduce Stress", emoji: "🌿" },
    improve_focus: { label: "Improve Focus", emoji: "🎯" },
    sleep_better: { label: "Sleep Better", emoji: "😴" },
    find_balance: { label: "Find Balance", emoji: "🧘‍♀️" },
  };

  const progress = goal ? 20 : 0;

  function handleStart() {
    const query = goal ? `?goal=${goal}` : "";
    router.push(`/quiz${query}`);
  }

  return (
    <section
      className={classes.heroSection}
      aria-label="Start Your Mindfulness Quiz"
    >
      <div className={classes.heroContent}>
        <div className={classes.textBlock}>
          <h1 className={classes.heading}>
            Cultivate <span className={classes.highlight}>Calm</span> & Clarity
            <span className={classes.subHeading}>
              Start Your Mindfulness Journey
            </span>
          </h1>

          <p className={classes.subText}>
            Take a quick quiz to receive a
            <span className={classes.bold}> tailored mental wellness plan</span>
            that suits your needs.
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
              What’s your main focus?
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
              You selected: {goals[goal].label}. Let's build your calm.
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
              href="/mindfulness/guides"
              className={classes.secondaryCta}
              aria-label="Explore mindfulness tips and guides"
            >
              Explore Free Tips & Guides
            </a>
          </div>

          <div className={classes.socialProof}>
            ⭐️⭐️⭐️⭐️⭐️ Trusted by 10,000+ to reduce stress and boost focus
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
