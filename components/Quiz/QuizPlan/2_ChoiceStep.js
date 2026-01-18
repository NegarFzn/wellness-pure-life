import { useEffect, useState } from "react";
import classes from "./Step.module.css";
import { trackQuizAnswer } from "../../lib/quizEvents";
import { gaEvent } from "../../../lib/gtag";

export default function ChoiceStep({
  slug,
  questionKey,
  defaultValue,
  updateAnswer,
  onNext,
  onBack,
  questions = [],
}) {
  const [selected, setSelected] = useState(defaultValue || "");
  const [questionData, setQuestionData] = useState(null);

  useEffect(() => {
    if (questions.length > 0) {
      const q = questions.find((q) => q.key === questionKey);
      if (q) setQuestionData(q);
    }
  }, [questions, questionKey]);

  useEffect(() => {
    if (!questionKey) return;

    gaEvent("plan_quiz_step_loaded", {
      slug,
      questionKey,
    });
  }, [slug, questionKey]);

  const handleNext = () => {
    if (selected) {
      // 🔥 GA4 EVENT: track answer selection
      trackQuizAnswer(slug, questionKey, selected);

      gaEvent("plan_quiz_next_clicked", {
        slug,
        questionKey,
        answer: selected,
      });
      // Update quiz state
      updateAnswer(selected);

      // Move to next question
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
            onClick={() => {
              setSelected(opt.value);

              gaEvent("plan_quiz_answer_clicked", {
                slug,
                questionKey,
                answer: opt.value,
              });
            }}
            aria-pressed={selected === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className={classes.navigation}>
        <button
          onClick={() => {
            gaEvent("plan_quiz_back_clicked", {
              slug,
              questionKey,
            });
            onBack();
          }}
          className={classes.button}
        >
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
