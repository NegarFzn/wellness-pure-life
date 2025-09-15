import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import classes from "./StartQuiz.module.css";

export default function NourishStartQuiz() {
  const router = useRouter();
  const [goal, setGoal] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const res = await fetch("/api/quiz/quiz-plan?mode=questions");
        const data = await res.json();

        // Find the document for slug: "nourish-plan"
        const quizDoc = data.find((d) => d.slug === "nourish-plan");

        if (!quizDoc) throw new Error("No nourish-plan quiz found");

        // Find the goal question inside the quiz
        const goalQuestion = quizDoc.questions.find((q) => q.key === "goal");

        if (goalQuestion?.options) {
          setGoals(goalQuestion.options);
        } else {
          throw new Error("Goal question not found in nourish-plan");
        }
      } catch (err) {
        console.error("❌ Failed to load goals:", err);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, []);

  const handleStart = () => {
    const query = goal ? `?goal=${goal}` : "";
    router.push(`/quizzes/quiz-plan${query}`);
  };

  const progress = goal ? 20 : 0;

  return (
    <section
      className={classes.heroSection}
      aria-label="Start Your Nourish Quiz"
    >
      <div className={classes.heroContent}>
        <div className={classes.textBlock}>
          <h1 className={classes.heading}>
            Nourish Your <span className={classes.highlight}>Body</span> &
            Wellness
            <span className={classes.subHeading}>
              Start Your Nutrition Journey Today
            </span>
          </h1>

          <p className={classes.subText}>
            Take a quick quiz to receive a{" "}
            <span className={classes.bold}>
              personalized meal & nutrition plan
            </span>{" "}
            based on your health goals and dietary preferences.
          </p>

          {/* Progress Bar */}
          <div
            className={classes.progressWrapper}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className={classes.progressBar}>
              <div
                className={classes.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Quiz Options */}
          <div className={classes.quizWrapper}>
            <label htmlFor="goal-options" className={classes.quizLabel}>
              What’s your main nutrition goal?
            </label>
            {loading ? (
              <p>Loading goals...</p>
            ) : goals.length === 0 ? (
              <p>No goals found.</p>
            ) : (
              <div
                id="goal-options"
                className={classes.goalOptions}
                role="radiogroup"
              >
                {goals.map((opt) => {
                  const active = goal === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setGoal(opt.value)}
                      className={`${classes.goalButton} ${
                        active ? classes.activeGoal : ""
                      }`}
                      aria-pressed={active}
                      aria-checked={active}
                      role="radio"
                    >
                      <span aria-hidden="true">{opt.emoji || "🥗"}</span>
                      <span className={classes.goalText}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selection Note */}
          {goal && (
            <div className={classes.selectionNote}>
              You selected:{" "}
              <strong>{goals.find((g) => g.value === goal)?.label}</strong>.
              Great choice for your body!
            </div>
          )}

          {/* CTA Buttons */}
          <div className={classes.ctaWrapper}>
            <button
              onClick={handleStart}
              className={classes.primaryCta}
              disabled={!goal}
            >
              {goal ? "Continue – Get My Plan →" : "Start the Quiz – It’s Free"}
            </button>

            <a href="/guides" className={classes.secondaryCta}>
              Explore Healthy Eating Guides
            </a>
          </div>

          <div className={classes.socialProof}>
            🥦🍎 Trusted by thousands to eat better and feel better
          </div>
        </div>
      </div>
    </section>
  );
}
