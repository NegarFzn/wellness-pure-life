import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import QuizEngine from "../../../components/Quiz/QuizPlan/QuizEngine"; // ✅ match uploaded QuizEngine
import classes from "./index.module.css";

export default function QuizPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [questions, setQuestions] = useState([]);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const storedQuestions = sessionStorage.getItem(`${slug}_questions`);
    const storedGoal = sessionStorage.getItem(`${slug}_goal`);

    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
    if (storedGoal) {
      setGoal(storedGoal);
    }

    // Fallback fetch if no stored session
    if (!storedQuestions) {
      const fetchQuestions = async () => {
        try {
          const res = await fetch("/api/quiz/quiz-plan?mode=questions");
          const data = await res.json();
          const quiz = data.find((q) => q.slug === slug);
          setQuestions(quiz?.questions || []);
        } catch (err) {
          console.error("❌ Failed to load quiz:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchQuestions();
    } else {
      setLoading(false);
    }
  }, [slug]);

  if (loading) return <p>Loading quiz...</p>;

  return (
    <main className={classes.centerWrapper}>
      <QuizEngine slug={slug} goal={goal} questions={questions} />
    </main>
  );
}
