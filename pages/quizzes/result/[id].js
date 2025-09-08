import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FitnessPlanSummary from "../../../components/Quiz/Summaries/FitnessPlanSummary";
import MindfulnessPlanSummary from "../../../components/Quiz/Summaries/MindfulnessPlanSummary";
import NourishPlanSummary from "../../../components/Quiz/Summaries/NourishPlanSummary";
import classes from "./ResultDetail.module.css"; 

export default function QuizResultDetail() {
  const { query } = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query.id) return;

    fetch("/api/quizzes?user=true")
      .then((res) => res.json())
      .then((data) => {
        const match = data.history?.find((r) => r._id === query.id);
        if (match) setResult(match);
      })
      .finally(() => setLoading(false));
  }, [query.id]);

  if (loading)
    return <p className={classes.loading}>⏳ Loading detailed result...</p>;
  if (!result) return <p className={classes.notFound}>❌ Result not found.</p>;

  const { slug, createdAt, answers = [] } = result;
  const lowerSlug = (slug || "").toLowerCase();

  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>🧾 Detailed Result</h1>
      <p className={classes.meta}>
        <strong>Quiz:</strong> {slug}
      </p>
      <p className={classes.meta}>
        <strong>Submitted:</strong> {new Date(createdAt).toLocaleString()}
      </p>

      {lowerSlug === "fitness-plan" && (
        <FitnessPlanSummary answers={convertToObject(answers)} />
      )}
      {lowerSlug === "mindfulness-plan" && (
        <MindfulnessPlanSummary answers={convertToObject(answers)} />
      )}
      {lowerSlug === "nourish-plan" && (
        <NourishPlanSummary answers={convertToObject(answers)} />
      )}

      {!["fitness-plan", "mindfulness-plan", "nourish-plan"].includes(
        lowerSlug
      ) && (
        <div className={classes.fallbackBox}>
          <h3>📋 Answers</h3>
          <ul className={classes.answerList}>
            {answers.map((a, i) => (
              <li key={i}>
                <strong>{a.question}:</strong> {a.answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function convertToObject(answers) {
  return Array.isArray(answers)
    ? answers.reduce((acc, a) => {
        acc[a.question] = a.answer;
        return acc;
      }, {})
    : answers;
}
