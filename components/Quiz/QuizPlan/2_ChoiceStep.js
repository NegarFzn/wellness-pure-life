import { useEffect, useState } from "react";
import classes from "./Step.module.css";

export default function ChoiceStep({
  slug,
  questionKey,
  defaultValue,
  updateAnswer,
  onNext,
  onBack,
  questions = [], // ✅ passed from QuizEngine
}) {
  const [selected, setSelected] = useState(defaultValue || "");
  const [questionData, setQuestionData] = useState(null);

  useEffect(() => {
    if (questions.length > 0) {
      const q = questions.find((q) => q.key === questionKey);
      if (q) setQuestionData(q);
    }
  }, [questions, questionKey]);

  const handleNext = () => {
    if (selected) {
      // ✅ only update parent state, no saving here
      updateAnswer(selected);
      onNext();
    }
  };

  if (!questionData) return <p>Question not found.</p>;

  return (
    <>
      <h2 className={classes.heading}>{questionData.question}</h2>
      <p className={classes.subheading}>Please select one option.</p>

      <div className={classes.optionGrid}>
        {questionData.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`${classes.optionButton} ${
              selected === opt.value ? classes.selected : ""
            }`}
            onClick={() => setSelected(opt.value)}
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
    </>
  );
}
