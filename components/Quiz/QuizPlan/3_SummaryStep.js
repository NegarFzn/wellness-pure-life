// components/Quiz/multi/steps/MultiSummaryStep.js
import classes from "./Step.module.css";

export default function MultiSummaryStep({
  onBack,
  onNext,
  answers,
  slug,
  questions = [],
}) {
  const getLabelForValue = (questionKey, value) => {
    const question = questions.find((q) => q.key === questionKey);
    if (!question) return value;
    const option = question.options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const renderAnswerItem = (key, value) => {
    const question = questions.find((q) => q.key === key);
    if (!question) return null;

    const questionLabel = question.question;
    const isMulti = question.multiSelect;

    return (
      <li key={key}>
        <strong>{questionLabel}</strong>:{" "}
        {isMulti && Array.isArray(value)
          ? value.map((val) => getLabelForValue(key, val)).join(", ")
          : getLabelForValue(key, value)}
      </li>
    );
  };

  return (
    <>
      <h2 className={classes.heading}>Review Your Plan Summary</h2>
      <p className={classes.subheading}>Here’s what you’ve shared with us:</p>

      <ul className={classes.summaryList}>
        {Object.entries(answers).map(([key, value]) =>
          renderAnswerItem(key, value)
        )}
      </ul>

      <div className={classes.navigation}>
        <button onClick={onBack} className={classes.button}>
          Back
        </button>
        <button onClick={onNext} className={classes.button}>
          Continue →
        </button>
      </div>
    </>
  );
}
