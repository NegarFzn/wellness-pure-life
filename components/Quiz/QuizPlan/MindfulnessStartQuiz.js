import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import classes from "./StartQuiz.module.css";

export default function MindfulnessStartQuiz() {
  const router = useRouter();
  const [goal, setGoal] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const res = await fetch("/api/quiz/quiz-plan?mode=questions");
        const data = await res.json();

        // Find the document for slug: "mindfulness-plan"
        const quizDoc = data.find((d) => d.slug === "mindfulness-plan");

        if (!quizDoc) throw new Error("No mindfulness-plan quiz found");

        // Find the goal question inside the quiz
        const goalQuestion = quizDoc.questions.find((q) => q.key === "goal");

        if (goalQuestion?.options) {
          setGoals(goalQuestion.options);
        } else {
          throw new Error("Goal question not found in mindfulness-plan");
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
      aria-label="Start Your Mindfulness Quiz"
    >
      <div className={classes.heroContent}>
        <div className={classes.textBlock}>
          <h1 className={classes.heading}>
            Cultivate Your <span className={classes.highlight}>Mind</span> &
            Emotions
            <span className={classes.subHeading}>
              Begin Your Mindfulness Journey
            </span>
          </h1>

          <p className={classes.subText}>
            Take a short quiz to receive a{" "}
            <span className={classes.bold}>personalized mindfulness plan</span>{" "}
            aligned with your emotional well-being and lifestyle.
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
              What’s your main focus?
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
                      <span aria-hidden="true">{opt.emoji || "🧘"}</span>
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
              Let’s enhance your inner peace!
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
              Browse Free Mindfulness Tips
            </a>
          </div>

          <div className={classes.socialProof}>
            🧘‍♀️🧘‍♂️ Practiced by thousands for a calmer life
          </div>
        </div>
      </div>
    </section>
  );
}
