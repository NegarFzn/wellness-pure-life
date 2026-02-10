import { useEffect, useState } from "react";
import classes from "./Step.module.css";
import { trackQuizAnswer } from "../../../lib/quizEvents";
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

  // Load question data
  useEffect(() => {
    if (questions.length > 0) {
      const q = questions.find((q) => q.key === questionKey);
      if (q) setQuestionData(q);
    }
  }, [questions, questionKey]);

  // ---------- STEP VIEW EVENTS ----------
  useEffect(() => {
    if (!questionKey) return;

    // GA4 view event
    gaEvent("plan_quiz_step_loaded", {
      slug,
      questionKey,
    });

    // KEY anomaly view event
    gaEvent("key_quiz_step_view", {
      slug,
      questionKey,
      stepType: "choice",
    });
  }, [slug, questionKey]);

  // ---------- NEXT BUTTON ----------
  const handleNext = () => {
    if (selected) {
      // GA4 event: answer recorded
      trackQuizAnswer(slug, questionKey, selected);

      gaEvent("plan_quiz_next_clicked", {
        slug,
        questionKey,
        answer: selected,
      });

      // KEY anomaly event: next clicked
      gaEvent("key_quiz_next_clicked", {
        slug,
        questionKey,
        answer: selected,
        stepType: "choice",
      });

      // KEY anomaly: step completed
      gaEvent("key_quiz_step_completed", {
        slug,
        questionKey,
        answer: selected,
        stepType: "choice",
      });

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
            onClick={() => {
              setSelected(opt.value);

              // GA4 click event
              gaEvent("plan_quiz_answer_clicked", {
                slug,
                questionKey,
                answer: opt.value,
              });

              // KEY anomaly event
              gaEvent("key_quiz_answer_select", {
                slug,
                questionKey,
                answer: opt.value,
                stepType: "choice",
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

            gaEvent("key_quiz_back_clicked", {
              slug,
              questionKey,
              stepType: "choice",
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
