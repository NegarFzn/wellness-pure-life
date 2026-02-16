"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { gaEvent } from "../../lib/gtag";
import MultiStartQuiz from "../../components/Quiz/QuizPlan/1_StartQuiz";
import classes from "./ResultCTA.module.css";

export default function QuizCTA({ planTypes }) {
  const router = useRouter();
  const [activeQuiz, setActiveQuiz] = useState(null);

  const goWeeklyPlan = () => {
    gaEvent("quiz_cta_weekly_plan_click");
    gaEvent("key_quiz_cta_weekly_plan_click");
    router.push("/plan/weekly-plan");
  };

  const goDailyRoutine = () => {
    gaEvent("quiz_cta_daily_routine_click");
    gaEvent("key_quiz_cta_daily_routine_click");
    router.push("/plan/daily-routine");
  };

  const goPremium = () => {
    gaEvent("quiz_cta_premium_click");
    gaEvent("key_quiz_cta_premium_click");
    router.push("/premium");
  };

  const openQuizModal = (type) => {
    setActiveQuiz(type);
    gaEvent("result_cta_plan_click", { plan: type });
    gaEvent("key_result_cta_plan_click", { plan: type });
  };

  const closeQuizModal = () => setActiveQuiz(null);

  return (
    <section className={classes.ctaContainer}>
      <div className={classes.decorativeBg} />

      <section className={classes.hero}>
        <h1 className={classes.heroTitle}>✨ Ready to turn insights into action?</h1>
        <p className={classes.heroSubtitle}>
          Your personalized wellness journey begins now. Choose your next step
          and turn your results into real progress.
        </p>

        <div className={classes.ctaButtonGroup}>
          <button className={classes.primaryBtn} onClick={goWeeklyPlan}>
            <span>See Your Weekly Plan</span>
          </button>

          <button className={classes.primaryBtn} onClick={goDailyRoutine}>
            <span>View Your Daily Routine</span>
          </button>

          <button className={classes.secondaryBtn} onClick={goPremium}>
            <span>Improve Your Results with Premium</span>
          </button>
        </div>
      </section>

      <div className={classes.sectionDivider} />

      <section className={classes.planSection}>
        <h2 className={classes.planTitle}>✨ Turn your results into a structured plan</h2>

        <div className={classes.planLinksGrid}>
          {Array.isArray(planTypes) && planTypes.map((item) => (
            <button
              key={item.type}
              className={classes.planCard}
              aria-label={`Open ${item.label} plan`}
              onClick={() => openQuizModal(item.type)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className={classes.blogCtaWrap}>
        <a
          href="/blog"
          className={classes.blogCta}
          onClick={() => {
            gaEvent("blog_support_click", { from: "quiz-page" });
            gaEvent("key_blog_support_click", { from: "quiz-page" });
          }}
        >
          Explore More Wellness Guides →
        </a>
      </section>

      {activeQuiz && (
        <div className={classes.modalOverlay} onClick={closeQuizModal}>
          <div
            className={classes.modalContent}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button className={classes.closeModal} aria-label="Close modal"   onClick={closeQuizModal}>
              ×
            </button>

            <MultiStartQuiz slug={`${activeQuiz}-plan`} />
          </div>
        </div>
      )}
    </section>
  );
}
