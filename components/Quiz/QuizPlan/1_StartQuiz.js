import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import classes from "./StartQuiz.module.css";

export default function MultiStartQuiz({ slug }) {
  const router = useRouter();
  const [goal, setGoal] = useState(null);
  const [goals, setGoals] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const res = await fetch("/api/quiz/quiz-plan?mode=questions");
        const data = await res.json();
        const quizDoc = data.find((q) => q.slug === slug);

        if (!quizDoc) throw new Error("Quiz not found for the given slug.");

        setQuestions(quizDoc.questions);

        const goalQuestion = quizDoc.questions.find((q) => q.key === "goal");
        if (!goalQuestion?.options) throw new Error("No goal question found.");
        setGoals(goalQuestion.options);
      } catch (err) {
        console.error("❌ Failed to load quiz:", err);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [slug]);

  const handleStart = () => {
    if (!goal) return;

    // ✅ Save questions + goal for this session
    sessionStorage.setItem(`${slug}_questions`, JSON.stringify(questions));
    sessionStorage.setItem(`${slug}_goal`, goal);

    // Redirect to index page with slug
    router.push(`/quizzes/quiz-plan?slug=${slug}`);
  };

  const progress = goal ? 20 : 0;

  const renderHeading = () => {
    if (slug === "fitness-plan") {
      return (
        <h1 className={classes.heading}>
          Transform Your <span className={classes.highlight}>Body</span> & Mind
          <span className={classes.subHeading}>
            Start Your Fitness Journey Today
          </span>
        </h1>
      );
    }
    if (slug === "mindfulness-plan") {
      return (
        <h1 className={classes.heading}>
          Cultivate Your <span className={classes.highlight}>Mind</span> &
          Emotions
          <span className={classes.subHeading}>
            Begin Your Mindfulness Journey
          </span>
        </h1>
      );
    }
    if (slug === "nourish-plan") {
      return (
        <h1 className={classes.heading}>
          Nourish Your <span className={classes.highlight}>Body</span> &
          Wellness
          <span className={classes.subHeading}>
            Start Your Nutrition Journey Today
          </span>
        </h1>
      );
    }
    return (
      <h1 className={classes.heading}>
        Start Your <span className={classes.highlight}>Wellness</span> Journey
        <span className={classes.subHeading}>Pick your main goal</span>
      </h1>
    );
  };

  return (
    <section className={classes.heroSection} aria-label="Start Quiz">
      <div className={classes.heroContent}>
        <div className={classes.textBlock}>
          {renderHeading()}

          <p className={classes.subText}>
            Take a quick quiz to get a{" "}
            <span className={classes.bold}>personalized plan</span> for your
            lifestyle.
          </p>

          {/* progress bar */}
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

          {/* goal options */}
          <div className={classes.quizWrapper}>
            <label htmlFor="goal-options" className={classes.quizLabel}>
              What’s your main goal?
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
                      role="radio"
                    >
                      <span aria-hidden="true">{opt.emoji || "🎯"}</span>
                      <span className={classes.goalText}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {goal && (
            <div className={classes.selectionNote}>
              You selected:{" "}
              <strong>{goals.find((g) => g.value === goal)?.label}</strong>.
              Let’s begin!
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
            <a href="/guides" className={classes.secondaryCta}>
              Explore Free Tips & Guides
            </a>
          </div>
          <div className={classes.socialProof}>
            ⭐️⭐️⭐️⭐️⭐️ Trusted by 10,000+ on their wellness journey
          </div>
        </div>
      </div>
    </section>
  );
}
