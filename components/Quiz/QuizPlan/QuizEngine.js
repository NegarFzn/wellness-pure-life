import { useState, useEffect } from "react";
import classes from "./QuizEngine.module.css";

// Import Fitness Steps
import MultiLevelStep from "./multi/steps/MultiLevelStep";
import ActivityPreferenceStep from "./multi/steps/ActivityPreferenceStep";
import TimeCommitmentStep from "./multi/steps/TimeCommitmentStep";
import CurrentChallengesStep from "./multi/steps/CurrentChallengesStep";
import MultiSummaryStep from "./multi/steps/MultiSummaryStep";
import MultiPlanSummary from "./multi/MultiPlanSummary";

export default function QuizEngine({ slug, goal }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const updateAnswer = (stepKey, value) => {
    setAnswers((prev) => ({ ...prev, [stepKey]: value }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    if (goal) {
      console.log("Setting goal:", goal);
      updateAnswer("goal", goal);
    }
  }, [goal]);

  const getStepsBySlug = () => {
    if (slug === "fitness-plan") {
      return [
        <MultiLevelStep
          key="fitnessLevel"
          onNext={nextStep}
          onBack={prevStep}
          updateAnswer={(val) => updateAnswer("fitnessLevel", val)}
          defaultValue={answers.fitnessLevel}
        />,
        <ActivityPreferenceStep
          key="activityPreference"
          onNext={nextStep}
          onBack={prevStep}
          updateAnswer={(val) => updateAnswer("activityPreference", val)}
          defaultValue={answers.activityPreference}
        />,
        <TimeCommitmentStep
          key="timeCommitment"
          onNext={nextStep}
          onBack={prevStep}
          updateAnswer={(val) => updateAnswer("timeCommitment", val)}
          defaultValue={answers.timeCommitment}
        />,
        <CurrentChallengesStep
          key="challenges"
          onNext={nextStep}
          onBack={prevStep}
          updateAnswer={(val) => updateAnswer("challenges", val)}
          defaultValue={answers.challenges}
        />,
        <MultiSummaryStep
          key="summary"
          onNext={nextStep}
          onBack={prevStep}
          answers={answers}
          slug={slug}
        />,
        <MultiPlanSummary key="plan" answers={answers} />,
      ];
    }

    return [<p key="unsupported">Slug not yet supported.</p>];
  };

  const steps = getStepsBySlug();
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={classes.quizWrapper}>
      <div className={classes.stepIndicator}>
        Step {currentStep + 1} of {steps.length}
      </div>

      <div className={classes.progressBar}>
        <div
          className={classes.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={classes.stepContent}>{steps[currentStep]}</div>
    </div>
  );
}
