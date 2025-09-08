// /pages/quizzes/summary/[category].jsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import classes from "./Summary.module.css";

export default function QuizSummaryPage() {
  const router = useRouter();
  const { category } = router.query;
  const { status } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    if (!category || status !== "authenticated") return;

    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/quizzes?category=${category}`);
        if (!res.ok) throw new Error("Failed to fetch quiz result");

        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [category, status]);

  if (loading || status === "loading") {
    return <p className={classes.loading}>⏳ Loading your result...</p>;
  }

  if (error || !data) {
    return (
      <div className={classes.errorBox}>
        <h2>🚫 Error Loading Result</h2>
        <p>{error || "No result found for this category."}</p>
        <button onClick={() => router.push("/")} className={classes.backBtn}>
          ← Back to Home
        </button>
      </div>
    );
  }

  const { answers, recommendations, message } = data;

  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>{message || "Your Personalized Plan"}</h1>

      <div className={classes.card}>
        {answers?.answers && (
          <ul className={classes.answerList}>
            {answers.answers.map((a, idx) => (
              <li key={idx}>
                <strong>{a.question}:</strong> {a.answer}
              </li>
            ))}
          </ul>
        )}
      </div>

      {recommendations?.length > 0 && (
        <div className={classes.recommendations}>
          <h2 className={classes.subheading}>🔍 Recommendations</h2>
          <ul className={classes.recommendationList}>
            {recommendations.map((rec, i) => (
              <li key={i}>
                <a href={rec.link} target="_blank" rel="noreferrer">
                  {rec.title || rec.link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
