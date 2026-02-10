import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trackQuizStart } from "../../../lib/quizEvents";
import { gaEvent } from "../../../lib/gtag";
import classes from "./StartQuiz.module.css";

export default function MultiStartQuiz({ slug }) {
  const router = useRouter();
  const [goal, setGoal] = useState(null);
  const [goals, setGoals] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // PAGE LOADED
  // ================================
  useEffect(() => {
    gaEvent("plan_quiz_landing_page_view", { slug });
    gaEvent("key_plan_quiz_landing_page_view", { slug });

    gaEvent("plan_quiz_start_screen_view", { slug });
    gaEvent("key_plan_quiz_start_screen_view", { slug });
  }, [slug]);

  // ================================
  // LOAD QUIZ QUESTIONS
  // ================================
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const res = await fetch("/api/quiz/quiz-plan?mode=questions");
        const data = await res.json();
        const quizDoc = data.find((q) => q.slug === slug);

        if (!quizDoc) throw new Error("Quiz not found for the given slug.");

        setQuestions(quizDoc.questions);

        gaEvent("plan_quiz_questions_loaded", {
          slug,
          total_questions: quizDoc.questions.length,
        });
        gaEvent("key_plan_quiz_questions_loaded", {
          slug,
          total_questions: quizDoc.questions.length,
        });

        const goalQuestion = quizDoc.questions.find((q) => q.key === "goal");
        if (!goalQuestion?.options) throw new Error("No goal question found.");

        setGoals(goalQuestion.options);

        gaEvent("plan_quiz_goals_displayed", {
          slug,
          number_of_goals: goalQuestion.options.length,
        });
        gaEvent("key_plan_quiz_goals_displayed", {
          slug,
          number_of_goals: goalQuestion.options.length,
        });
      } catch (err) {
        console.error("❌ Failed to load quiz:", err);
        setGoals([]);

        gaEvent("plan_quiz_load_error", { slug, error: err.message });
        gaEvent("key_plan_quiz_load_error", { slug, error: err.message });
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [slug]);

  // ================================
  // GOAL OPTIONS VIEW EVENT
  // ================================
  useEffect(() => {
    if (goals.length > 0) {
      gaEvent("plan_quiz_goal_options_view", {
        slug,
        total_goals: goals.length,
      });
      gaEvent("key_plan_quiz_goal_options_view", {
        slug,
        total_goals: goals.length,
      });
    }
  }, [goals]);

  useEffect(() => {
    gaEvent("plan_quiz_start_page_loaded", { slug });
    gaEvent("key_plan_quiz_start_page_loaded", { slug });
  }, [slug]);

  // ================================
  // GOAL SELECT
  // ================================
  const handleGoalSelect = (value) => {
    setGoal(value);

    gaEvent("quiz_goal_selected", { slug, goal: value });
    gaEvent("key_quiz_goal_selected", { slug, goal: value });
  };

  // ================================
  // START QUIZ
  // ================================
  const handleStart = () => {
    if (!goal) return;

    trackQuizStart(slug);

    gaEvent("key_quiz_plan_start", {
      slug,
      goal,
      source: "StartQuizComponent",
    });

    gaEvent("plan_quiz_continue_click", { slug, goal });
    gaEvent("key_plan_quiz_continue_click", { slug, goal });

    sessionStorage.setItem(`${slug}_questions`, JSON.stringify(questions));
    sessionStorage.setItem(`${slug}_goal`, goal);

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
    <section className={classes.heroSection}>
      <div className={classes.heroBackground} />

      <div className={classes.heroContent}>
        <div className={classes.textBlock}>
          {renderHeading()}

          <p className={classes.subText}>
            Take a quick quiz to get a{" "}
            <span className={classes.bold}>personalized plan</span> for your
            lifestyle.
          </p>

          {goal && (
            <div className={classes.progressWrapper}>
              <div className={classes.progressBar}>
                <div
                  className={classes.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className={classes.quizWrapper}>
            <label className={classes.quizLabel}>What’s your main goal?</label>

            {loading ? (
              <p className={classes.loadingText}>Loading goals...</p>
            ) : (
              <div className={classes.goalGrid}>
                {goals.map((opt) => {
                  const active = goal === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleGoalSelect(opt.value)}
                      className={`${classes.goalCard} ${active ? classes.activeGoal : ""}`}
                    >
                      <div className={classes.goalIcon}>
                        {opt.emoji || "🎯"}
                      </div>
                      <div className={classes.goalText}>{opt.label}</div>
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
              {goal ? "Continue – Get My Plan →" : "Start the Quiz"}
            </button>
          </div>

          <div className={classes.socialProof}>
            ⭐️⭐️⭐️⭐️⭐️ Trusted by 10,000+ on their wellness journey
          </div>
        </div>
      </div>
    </section>
  );
}
