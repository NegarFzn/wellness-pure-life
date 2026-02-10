import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { gaEvent } from "../../../lib/gtag";
import QuizEngine from "../../../components/Quiz/QuizPlan/QuizEngine";
import classes from "./index.module.css";

export default function QuizPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [questions, setQuestions] = useState([]);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    // PAGE VIEW
    gaEvent("quiz_page_view", { slug });
    gaEvent("key_quiz_page_view", { slug });

    const storedQuestions = sessionStorage.getItem(`${slug}_questions`);
    const storedGoal = sessionStorage.getItem(`${slug}_goal`);

    if (storedQuestions || storedGoal) {
      gaEvent("quiz_page_session_restore", { slug });
      gaEvent("key_quiz_page_session_restore", { slug });
    }

    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
    if (storedGoal) {
      setGoal(storedGoal);
    }

    // Fetch from API if no session
    if (!storedQuestions) {
      const fetchQuestions = async () => {
        try {
          const res = await fetch("/api/quiz/quiz-plan?mode=questions");
          const data = await res.json();
          const quiz = data.find((q) => q.slug === slug);

          setQuestions(quiz?.questions || []);

          // SUCCESS EVENT
          gaEvent("quiz_page_loaded", { slug });
          gaEvent("key_quiz_page_loaded", { slug });
        } catch (err) {
          console.error("❌ Failed to load quiz:", err);

          gaEvent("quiz_page_error", { slug, error: err.message });
          gaEvent("key_quiz_page_error", { slug, error: err.message });
        } finally {
          setLoading(false);
        }
      };
      fetchQuestions();
    } else {
      gaEvent("quiz_page_loaded", { slug });
      gaEvent("key_quiz_page_loaded", { slug });
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
