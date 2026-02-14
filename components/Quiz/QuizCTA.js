"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { gaEvent } from "../../lib/gtag";
import MultiStartQuiz from "../Quiz/QuizPlan/1_StartQuiz";
import classes from "./QuizCTA.module.css";

export default function QuizCTA({ planTypes }) {
  const router = useRouter();
  const [activeQuiz, setActiveQuiz] = useState(null);

  // ============================
  // Navigation CTA Actions
  // ============================
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

  // ============================
  // Plan → MultiStartQuiz
  // ============================
  const openQuizModal = (type) => {
    setActiveQuiz(type);

    gaEvent("result_cta_plan_click", { plan: type });
    gaEvent("key_result_cta_plan_click", { plan: type });
  };

  const closeQuizModal = () => {
    setActiveQuiz(null);
  };

  return (
    <div className={classes.ctaContainer}>
      {/* MAIN CTA TITLE */}
      <h3 className={classes.ctaTitle}>
        ✨ Ready to turn insights into action?
      </h3>

      {/* MAIN ACTION BUTTONS */}
      <button className={classes.primaryBtn} onClick={goWeeklyPlan}>
        🚀 See Your Weekly Plan →
      </button>

      <button className={classes.primaryBtn} onClick={goDailyRoutine}>
        📅 View Your Daily Routine →
      </button>

      <button className={classes.secondaryBtn} onClick={goPremium}>
        ⭐ Improve Your Results with Premium →
      </button>

      {/* DIVIDER */}
      <hr className={classes.divider} />

      {/* STRUCTURED PLAN SECTION */}
      <h4 className={classes.softPremiumTitle}>
        ✨ Turn your results into a structured plan
      </h4>

      <div className={classes.noPlan}>
        <div className={classes.planLinksGrid}>
          {planTypes.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => openQuizModal(type)}
              className={classes.takePlanLink}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className={classes.blogCtaWrap}>
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
      </div>
      {/* MODAL */}
      {activeQuiz && (
        <div className={classes.modalOverlay} onClick={() => closeQuizModal()}>
          <div
            className={classes.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={classes.closeModal}
              onClick={() => closeQuizModal()}
            >
              ❌
            </button>
            <MultiStartQuiz slug={`${activeQuiz}-plan`} />
          </div>
        </div>
      )}
    </div>
  );
}
