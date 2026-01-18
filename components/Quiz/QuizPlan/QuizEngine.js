import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ChoiceStep from "./2_ChoiceStep";
import MultiSummaryStep from "./3_SummaryStep";
import MultiPlanSummary from "./4_PlanSummary";
import { gaEvent } from "../../../lib/gtag";

import classes from "./QuizEngine.module.css";

export default function QuizEngine({
  slug,
  goal,
  questions: initialQuestions = [],
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState(initialQuestions);
  const [loading, setLoading] = useState(initialQuestions.length === 0);

  const router = useRouter();
  const { data: session } = useSession();

  const updateAnswer = (stepKey, value) => {
    setAnswers((prev) => ({ ...prev, [stepKey]: value }));

    // GA4: question answered event
    gaEvent("quiz_question_answered", {
      slug,
      question_key: stepKey,
      answer_value: value,
    });
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  // Fallback fetch only if no questions were passed in
  useEffect(() => {
    if (initialQuestions.length > 0) return;

    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/quiz/quiz-plan?mode=questions");
        const data = await res.json();
        const quiz = data.find((q) => q.slug === slug);

        if (quiz?.questions) {
          setQuestions(quiz.questions);
        }
      } catch (err) {
        console.error("❌ Failed to load questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [slug, initialQuestions]);

  // Pre-fill goal if passed from StartQuiz
  useEffect(() => {
    if (goal) {
      updateAnswer("goal", goal);
    }
  }, [goal]);

  if (loading) return <p>Loading quiz...</p>;

  const steps = [
    ...questions.map((q) => (
      <ChoiceStep
        key={q.key}
        slug={slug}
        questionKey={q.key}
        defaultValue={answers[q.key]}
        updateAnswer={(val) => updateAnswer(q.key, val)}
        onNext={nextStep}
        onBack={prevStep}
        questions={questions} // ✅ so it doesn’t refetch
      />
    )),
    <MultiSummaryStep
      key="summary"
      onNext={nextStep}
      onBack={prevStep}
      answers={answers}
      slug={slug}
      questions={questions}
    />,
    <MultiPlanSummary
      key="plan"
      answers={answers}
      questions={questions}
      slug={slug}
      session={session}
      router={router}
    />,
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    if (questions.length === 0) return;

    const isSummary = currentStep === questions.length;
    const isPlan = currentStep === questions.length + 1;

    let step_label = "question_step";
    if (isSummary) step_label = "summary_step";
    if (isPlan) step_label = "plan_step";

    gaEvent("quiz_step", {
      slug,
      step_number: currentStep + 1,
      total_steps: steps.length,
      step_label,
    });
  }, [currentStep, slug]);

  useEffect(() => {
    // Fire ONLY when the user begins the quiz (step 0)
    if (currentStep === 0) {
      gaEvent("quiz_started", { slug });
    }
  }, [currentStep, slug]);

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
