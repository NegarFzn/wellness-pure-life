// pages/quiz/index.jsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import QuizEngine from "../../../components/Quiz/QuizPlan/QuizEngine";
import classes from "./index.module.css";

const goalLabels = {
  fitness: "🏋️ Fitness",
  get_toned: "💪 Get Toned",
  lose_weight: "🔥 Lose Weight",
  build_muscle: "🏆 Build Muscle",
  improve_wellness: "🧘 Improve Wellness",
  mindfulness: "🧠 Mindfulness",
  nourish: "🍎 Nourish",
};

export default function QuizPage() {
  const router = useRouter();
  const { goal } = router.query;

  const [quiz, setQuiz] = useState([]);
  const [slug, setSlug] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!goal) return;

    const goalMap = {
      fitness: "fitness-plan",
      get_toned: "fitness-plan",
      lose_weight: "fitness-plan",
      build_muscle: "fitness-plan",
      improve_wellness: "fitness-plan",
      mindfulness: "mindfulness-plan",
      nourish: "nourish-plan",
    };

    const cleaned = goal.toLowerCase();
    const resolvedSlug = goalMap[cleaned];

    if (!resolvedSlug) {
      setError("Invalid goal. Please go back and choose a valid one.");
      setLoading(false);
      return;
    }

    setSlug(resolvedSlug);
    setLabel(goalLabels[cleaned] || "");

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/quiz/quiz-plan?mode=questions`);
        const data = await res.json();

        let questions = [];

        // Case 1: [{ slug, questions }] array format
        if (Array.isArray(data)) {
          const match = data.find(
            (entry) => entry?.slug?.toLowerCase() === resolvedSlug
          );
          questions = match?.questions || [];
        }

        // Case 2: { slug, questions } object format
        else if (
          typeof data === "object" &&
          data?.slug?.toLowerCase() === resolvedSlug
        ) {
          questions = data.questions || [];
        }

        if (!questions.length) {
          throw new Error("No quiz questions found for this goal.");
        }

        setQuiz(questions);
      } catch (err) {
        console.error("❌ Error loading quiz data:", err);
        setError("Failed to load quiz questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [goal]);

  if (loading) {
    return (
      <div className={classes.loading}>
        <div className={classes.loader}></div>
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.invalidContainer}>
        <h2 className={classes.heading}>🚫 {error}</h2>
        <p className={classes.message}>
          Valid options: <strong>Fitness</strong>, <strong>Mindfulness</strong>,
          or <strong>Nourish</strong>.
        </p>
        <button className={classes.backBtn} onClick={() => router.push("/")}>
          ← Return to Home
        </button>
      </div>
    );
  }

  return (
    <main className={classes.quizPage}>
      <section className={classes.quizContainer}>
        {label && <div className={classes.goalHeader}>🎯 Goal: {label}</div>}
        <QuizEngine slug={slug} quiz={quiz} goal={goal} />
      </section>
    </main>
  );
}
