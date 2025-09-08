import { useEffect, useState } from "react";
import classes from "./Step.module.css";

export default function CurrentChallengesStep({
  onNext,
  onBack,
  updateAnswer,
  defaultValue = "",
}) {
  const [selected, setSelected] = useState(defaultValue);
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch("/api/quiz/quiz-plan?mode=questions");
        const data = await res.json();

        const fitnessQuiz = data.find((quiz) => quiz.slug === "fitness-plan");
        if (fitnessQuiz && fitnessQuiz.questions) {
          const q = fitnessQuiz.questions.find((q) => q.key === "challenges");
          if (q) setQuestionData(q);
        }
      } catch (err) {
        console.error("❌ Failed to fetch challenges question:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, []);

  const handleSelect = (value) => {
    setSelected(value);
  };

  const handleNext = () => {
    if (selected) {
      updateAnswer(selected); // pass as string
      onNext();
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!questionData) return <p>Question not found.</p>;

  return (
    <div className={classes.stepContainer}>
      <h2 className={classes.heading}>{questionData.question}</h2>
      <p className={classes.subheading}>Select the one that applies.</p>

      <div className={classes.optionGrid}>
        {questionData.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`${classes.optionButton} ${
              selected === opt.value ? classes.selected : ""
            }`}
            onClick={() => handleSelect(opt.value)}
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
