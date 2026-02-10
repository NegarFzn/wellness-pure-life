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

  // ============================
  // INITIAL IMPRESSION EVENTS
  // ============================
  useEffect(() => {
    gaEvent("quiz_view", { slug });
    gaEvent("key_quiz_view", { slug });

    gaEvent("quiz_start_impression", { slug });
    gaEvent("key_quiz_start_impression", { slug });
  }, [slug]);

  // ============================
  // UPDATE ANSWER
  // ============================
  const updateAnswer = (stepKey, value) => {
    setAnswers((prev) => ({ ...prev, [stepKey]: value }));

    gaEvent("quiz_question_answered", {
      slug,
      question_key: stepKey,
      answer_value: value,
    });

    gaEvent("key_quiz_question_answered", {
      slug,
      question_key: stepKey,
      answer_value: value,
    });
  };

  // ============================
  // STEP NAVIGATION
  // ============================
  const nextStep = () => {
    gaEvent("quiz_next_click", { slug, step: currentStep + 1 });
    gaEvent("key_quiz_next_click", { slug, step: currentStep + 1 });

    gaEvent("key_quiz_step_completed", {
      slug,
      step_number: currentStep + 1,
    });

    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    gaEvent("quiz_back_click", { slug, step: currentStep });
    gaEvent("key_quiz_back_click", { slug, step: currentStep });

    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // ============================
  // FETCH QUESTIONS (WHEN EMPTY)
  // ============================
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
        gaEvent("quiz_load_error", { slug, error: String(err) });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [slug, initialQuestions]);

  // ============================
  // PRE-FILL GOAL
  // ============================
  useEffect(() => {
    if (goal) {
      updateAnswer("goal", goal);
    }
  }, [goal]);

  if (loading) return <p>Loading quiz...</p>;

  // ============================
  // BUILD STEPS
  // ============================
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
        questions={questions}
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
      // inside MultiPlanSummary you MUST fire:
      // gaEvent("quiz_completed", { slug })
      // gaEvent("key_quiz_completed", { slug })
    />,
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  // ============================
  // STEP VIEW TRACKER
  // ============================
  useEffect(() => {
    if (questions.length === 0) return;

    const isSummary = currentStep === questions.length;
    const isPlan = currentStep === questions.length + 1;

    let step_label = "question_step";
    if (isSummary) {
      step_label = "summary_step";
      gaEvent("quiz_summary_view", { slug });
      gaEvent("key_quiz_summary_view", { slug });
    }
    if (isPlan) {
      step_label = "plan_step";
      gaEvent("quiz_plan_view", { slug });
      gaEvent("key_quiz_plan_view", { slug });
    }

    gaEvent("quiz_step", {
      slug,
      step_number: currentStep + 1,
      total_steps: steps.length,
      step_label,
    });
  }, [currentStep, slug, questions.length]);

  // ============================
  // QUIZ STARTED EVENT
  // ============================
  useEffect(() => {
    if (currentStep === 0) {
      gaEvent("quiz_started", { slug });
      gaEvent("key_quiz_started", { slug });
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
