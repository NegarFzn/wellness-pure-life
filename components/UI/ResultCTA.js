"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { gaEvent } from "../../lib/gtag";
import MultiStartQuiz from "../../components/Quiz/QuizPlan/1_StartQuiz";
import { useSession } from "next-auth/react";
import classes from "./ResultCTA.module.css";

export default function ResultCTA({ planTypes, onOpenModal }) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user || null;
  const isPremium = !!user?.isPremium;

  const [activeQuiz, setActiveQuiz] = useState(null);

  // ============================================
  // SMART NAVIGATION LOGIC (unchanged)
  // ============================================
  const goWeeklyPlan = () => {
    gaEvent("quiz_cta_weekly_plan_click");
    gaEvent("key_quiz_cta_weekly_plan_click");

    if (!user) {
      router.push("/sample/weekly-plan");
      return;
    }

    if (!isPremium) {
      router.push("/sample/weekly-plan");
      return;
    }

    router.push("/plan/weekly-plan");
  };

  const goDailyRoutine = () => {
    gaEvent("quiz_cta_daily_routine_click");
    gaEvent("key_quiz_cta_daily_routine_click");

    if (!user) {
      router.push("/sample/daily-routine");
      return;
    }

    if (!isPremium) {
      router.push("/sample/daily-routine");
      return;
    }

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

      {/* =========================
          TOP FUNNEL HERO (UPDATED)
      ========================== */}
      <section className={classes.hero}>
        <h1 className={classes.heroTitle}>
          ✨ Your personalized wellness plan is ready
        </h1>

        <p className={classes.heroSubtitle}>
          Based on your quiz results, your tailored weekly plan and daily
          routine are prepared. Start now and turn your insights into lasting
          progress.
        </p>

        <div className={classes.ctaButtonGroup}>
          <button className={classes.primaryBtn} onClick={goWeeklyPlan}>
            <span>View My Weekly Plan</span>
          </button>

          <button className={classes.primaryBtn} onClick={goDailyRoutine}>
            <span>View My Daily Routine</span>
          </button>

          {!isPremium && (
            <button className={classes.secondaryBtn} onClick={goPremium}>
              <span>
                Unlock Long-Term Plans & Progress Tracking with Premium
              </span>
            </button>
          )}
        </div>
      </section>

      <div className={classes.sectionDivider} />

      {/* =========================
          STRUCTURED PLAN SECTION
      ========================== */}
      <section className={classes.planSection}>
        <h2 className={classes.planTitle}>
          ✨ Build your structured wellness plan
        </h2>

        <div className={classes.planLinksGrid}>
          {Array.isArray(planTypes) &&
            planTypes.map((item) => (
              <button
                key={item.type}
                className={classes.planCard}
                aria-label={`Open ${item.label} plan`}
                onClick={() => onOpenModal(item.type)}
              >
                <span>{item.label}</span>
              </button>
            ))}
        </div>
      </section>

      {/* =========================
          BLOG SUPPORT CTA
      ========================== */}
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

      {/* =========================
          QUIZ MODAL
      ========================== */}
      {activeQuiz && (
        <div className={classes.modalOverlay} onClick={closeQuizModal}>
          <div
            className={classes.modalContent}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className={classes.closeModal}
              aria-label="Close modal"
              onClick={closeQuizModal}
            >
              ×
            </button>

            <MultiStartQuiz slug={`${activeQuiz}-plan`} />
          </div>
        </div>
      )}
    </section>
  );
}
