import { useEffect, useState } from "react";
import classes from "./Step.module.css";

export default function ActivityPreferenceStep({
  onNext,
  onBack,
  updateAnswer,
  defaultValue,
}) {
  const [selected, setSelected] = useState(defaultValue || "");
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch("/api/quiz/quiz-plan?mode=questions");
        const data = await res.json();

        // Find the activityPreference question from the fitness-plan quiz
        const fitnessQuiz = data.find((quiz) => quiz.slug === "fitness-plan");

        if (fitnessQuiz && fitnessQuiz.questions) {
          const q = fitnessQuiz.questions.find(
            (q) => q.key === "activityPreference"
          );
          if (q) setQuestionData(q);
        }
      } catch (err) {
        console.error("❌ Failed to fetch question data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, []);

  const handleNext = () => {
    if (selected) {
      updateAnswer(selected);
      onNext();
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!questionData) return <p>Question not found.</p>;

  return (
    <div className={classes.stepContainer}>
      <h2 className={classes.heading}>{questionData.question}</h2>
      <p className={classes.subheading}>
        Pick the type of activity you enjoy most.
      </p>

      <div className={classes.optionGrid}>
        {questionData.options.map((opt) => (
          <button
            key={opt.value}
            className={`${classes.optionButton} ${
              selected === opt.value ? classes.selected : ""
            }`}
            onClick={() => setSelected(opt.value)}
            type="button"
            aria-pressed={selected === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className={classes.navigation}>
        <button onClick={onBack} className={classes.button}>
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!selected}
          className={classes.button}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
