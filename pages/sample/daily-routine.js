"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { gaEvent } from "../../lib/gtag";
import MultiStartQuiz from "../../components/Quiz/QuizPlan/1_StartQuiz";
import classes from "./daily-routine.module.css";

export default function SampleDailyRoutine() {
  const [activeQuiz, setActiveQuiz] = useState(null);

  // PAGE VIEW + ANOMALY
  useEffect(() => {
    gaEvent("daily_routine_sample_view");
    gaEvent("key_daily_routine_sample_view");
  }, []);

  // ============================
  // QUIZ MODAL HANDLERS
  // ============================
  const openQuizModal = (type) => {
    setActiveQuiz(type);
    gaEvent("sample_daily_quiz_open", { quiz: type });
    gaEvent("key_sample_daily_quiz_open", { quiz: type });
  };

  const closeQuizModal = () => setActiveQuiz(null);

  // ============================
  // QUIZ BUTTON DEFINITIONS
  // ============================
  const planTypes = [
    { type: "fitness", label: "Try Fitness Quiz" },
    { type: "mindfulness", label: "Try Mindfulness Quiz" },
    { type: "nourish", label: "Try Nourish Quiz" },
  ];

  return (
    <>
      <Head>
        <title>Sample Daily Routine | Wellness Pure Life</title>
      </Head>

      <div className={classes.page}>
        {/* ============================
            TOP PAGE CONTENT
        ============================ */}
        <header className={classes.header}>
          <h1 className={classes.title}>Sample Daily Routine</h1>
          <p className={classes.subtitle}>
            An example of how a Premium daily routine can gently structure your
            day around movement, calm, focus, and recovery — without feeling
            overwhelming or rigid.
          </p>

          <div className={classes.topBridge}>
            <h2>Your personalized daily routine is ready</h2>

            <p>
              Based on your quiz insights, your adaptive daily structure is
              prepared. This preview shows the flow — Premium unlocks your real
              routine tailored to your energy, schedule, and goals.
            </p>

            <div className={classes.topBridgeButtons}>
              <Link
                href="/premium"
                className={classes.primary}
                onClick={() => {
                  gaEvent("daily_routine_top_unlock_click");
                  gaEvent("key_daily_routine_top_unlock_click");
                }}
              >
                Unlock My Daily Routine
              </Link>

              <Link
                href="/quizzes/quiz-main"
                className={classes.secondary}
                onClick={() => {
                  gaEvent("daily_routine_learn_more_click");
                  gaEvent("key_daily_routine_learn_more_click");
                }}
              >
                Try Free Quiz
              </Link>
            </div>
          </div>
        </header>

        {/* ============================
            ROUTINE BLOCKS
        ============================ */}
        <section className={classes.blocks}>
          {/* Morning */}
          <article className={classes.block}>
            <h2 className={classes.blockTitle}>Morning Reset</h2>
            <p className={classes.blockTag}>Start calm, not rushed</p>
            <ul className={classes.list}>
              <li>💧 Drink a glass of water before coffee.</li>
              <li>🧘 5 minutes of breathing with longer exhales.</li>
              <li>🚶 5–10 minutes of light movement or stretching.</li>
              <li>📓 Optional: write 1–2 sentences about how you want to feel today.</li>
            </ul>
          </article>

          {/* Midday */}
          <article className={classes.block}>
            <h2 className={classes.blockTitle}>Midday Support</h2>
            <p className={classes.blockTag}>Protect energy & focus</p>
            <ul className={classes.list}>
              <li>🥗 Balanced lunch (protein + fibre).</li>
              <li>🚶 5–10 minutes of walking after eating.</li>
              <li>🧠 One short “focus block”.</li>
              <li>🌬️ 1–2 minutes slow breathing when tension rises.</li>
            </ul>
          </article>

          {/* Evening */}
          <article className={classes.block}>
            <h2 className={classes.blockTitle}>Evening Wind-Down</h2>
            <p className={classes.blockTag}>Help your body feel safe to rest</p>
            <ul className={classes.list}>
              <li>📱 Reduce screens 30–60 minutes before bed.</li>
              <li>🧍 Gentle stretching or slow movement.</li>
              <li>🕯️ Write one thing you’re grateful for.</li>
              <li>🌙 Maintain a consistent bedtime.</li>
            </ul>
          </article>
        </section>

        {/* ============================
            BOTTOM CTA WITH MODAL BUTTONS
        ============================ */}
        <section className={classes.bottomCta}>
          <h2>Ready to explore your personalized wellness insights?</h2>

          <p>
            Choose a wellness quiz and start receiving personalized insights
            based on your fitness, mindfulness, and nutrition profile.
          </p>

          <div className={classes.buttons}>
            <Link
              href="/premium"
              className={classes.primary}
              onClick={() => {
                gaEvent("daily_routine_sample_premium_click");
                gaEvent("key_daily_routine_sample_premium_click");
              }}
            >
              Unlock My Daily Routine
            </Link>

            {planTypes.map((item) => (
              <button
                key={item.type}
                className={classes.secondary}
                aria-label={`Open ${item.label} quiz`}
                onClick={() => openQuizModal(item.type)}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
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
      </div>
    </>
  );
}
