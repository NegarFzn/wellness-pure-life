"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { gaEvent } from "../../lib/gtag";
import MultiStartQuiz from "../../components/Quiz/QuizPlan/1_StartQuiz";

import classes from "./weekly-plan.module.css";

const WEEK_VARIANTS = {
  calm: {
    name: "Calm & Reset Week",
    description:
      "A gentle, nervous-system-friendly week that focuses on soft movement, calm breathing, and simple nourishment to help you feel safer, lighter, and more grounded.",
    accent: "calm",
    days: [
      {
        day: "Monday",
        theme: "Gentle Activation",
        focus:
          "Start the week softly and remind your body that it is safe to move slowly.",
        fitness: "10–20 min light mobility or stretching.",
        mindfulness: "5 min breathing pause with longer exhales.",
        nourish: "Hydrating breakfast plus simple protein and fruit.",
      },
      {
        day: "Tuesday",
        theme: "Balance & Stability",
        focus: "Stabilise your energy through predictable, gentle routines.",
        fitness: "Short walk or easy low-impact routine.",
        mindfulness: "Body scan in a comfortable position.",
        nourish: "Warm, easy-to-digest meals and steady hydration.",
      },
      {
        day: "Wednesday",
        theme: "Nervous System Reset",
        focus: "Release tension from shoulders, jaw, and hips.",
        fitness: "Mobility flow focusing on joints and spine.",
        mindfulness: "Somatic check-in: notice areas of tightness and soften.",
        nourish: "Colourful plate with veggies, good fats, and protein.",
      },
      {
        day: "Thursday",
        theme: "Soft Momentum",
        focus: "Stay consistent with small wins instead of big pushes.",
        fitness: "Gentle low-impact circuit or longer walk.",
        mindfulness: "Gratitude list for small things that went well.",
        nourish: "Balanced lunch and a nourishing evening snack.",
      },
      {
        day: "Friday",
        theme: "Light Strength",
        focus: "Build confidence with safe, simple strength work.",
        fitness: "Beginner strength (bodyweight or light weights).",
        mindfulness: "Few breaths between sets to stay calm and present.",
        nourish: "Protein-centred meal to support recovery.",
      },
      {
        day: "Saturday",
        theme: "Restore & Enjoy",
        focus: "Let the body feel pleasure and rest without guilt.",
        fitness: "Stretching, yoga, or a playful outdoor walk.",
        mindfulness: "Enjoyment check-in: notice something you genuinely like.",
        nourish: "Comforting but not heavy meals plus extra fluids.",
      },
      {
        day: "Sunday",
        theme: "Prepare & Ground",
        focus: "Create a calm landing for the week ahead.",
        fitness: "Easy walk + 5–10 min stretching.",
        mindfulness: "Weekly reflection: what felt good, what to keep.",
        nourish: "Simple prep for a few meals or snacks for next week.",
      },
    ],
  },
  energy: {
    name: "Energy & Strength Week",
    description:
      "A structured week to gently raise your energy, support strength, and keep your mind clear without burning out.",
    accent: "energy",
    days: [
      {
        day: "Monday",
        theme: "Strong Start",
        focus: "Wake up muscles and sharpen focus without overdoing it.",
        fitness: "Full-body light strength circuit.",
        mindfulness: "3 deep breaths before each new block.",
        nourish: "Protein-rich breakfast and stable carbs.",
      },
      {
        day: "Tuesday",
        theme: "Endurance & Patience",
        focus: "Build capacity through consistent, sustainable effort.",
        fitness: "Low-impact cardio (brisk walk / cycle).",
        mindfulness: "Notice your breathing rhythm while moving.",
        nourish: "Light lunch + smart snack before exercise.",
      },
      {
        day: "Wednesday",
        theme: "Core & Posture",
        focus: "Support your spine and posture for long-term comfort.",
        fitness: "Core activation + gentle posterior chain work.",
        mindfulness: "Check in with how your body carries itself.",
        nourish: "Balanced plate with greens and healthy fats.",
      },
      {
        day: "Thursday",
        theme: "Focus & Flow",
        focus: "Combine movement with mental clarity.",
        fitness: "Mobility and balance-based routine.",
        mindfulness: "Short focus ritual before work or tasks.",
        nourish: "Steady hydration and light afternoon snack.",
      },
      {
        day: "Friday",
        theme: "Confidence Boost",
        focus: "Celebrate what your body can already do.",
        fitness: "Strength day (beginner or moderate level).",
        mindfulness: "Reflect on improvements, even if small.",
        nourish: "Satisfying dinner that still feels supportive.",
      },
      {
        day: "Saturday",
        theme: "Playful Activity",
        focus: "Let movement feel fun and less structured.",
        fitness: "Outdoor walk, dance, or playful movement.",
        mindfulness: "Notice moments of joy in your body.",
        nourish: "Enjoy a favourite meal mindfully and slowly.",
      },
      {
        day: "Sunday",
        theme: "Reset & Regulate",
        focus: "Re-balance energy so next week feels lighter.",
        fitness: "Walk + long stretching session.",
        mindfulness: "Gentle breathing ritual before sleep.",
        nourish: "Early, calming dinner and warm drink.",
      },
    ],
  },
  focus: {
    name: "Focus & Clarity Week",
    description:
      "A week structured around mental clarity, reduced brain fog, and stable focus using gentle movement, breathing, and simple food structure.",
    accent: "focus",
    days: [
      {
        day: "Monday",
        theme: "Clear Start",
        focus: "Clean up mental clutter and start with one clear intention.",
        fitness: "Short mobility + posture resets.",
        mindfulness: "5-min morning focus ritual.",
        nourish: "Hydration + a simple breakfast with protein.",
      },
      {
        day: "Tuesday",
        theme: "Deep Work Windows",
        focus: "Create 1–2 focused blocks with clear start and end.",
        fitness: "Walk before or after focused work.",
        mindfulness: "Mini-breath breaks between tasks.",
        nourish: "Avoid heavy lunches that induce sleepiness.",
      },
      {
        day: "Wednesday",
        theme: "Midweek Clarity",
        focus: "Realign goals and remove unnecessary tasks.",
        fitness: "Light cardio or steps accumulation.",
        mindfulness: "5–10 min journaling or mental declutter.",
        nourish: "Colourful, simple lunch to support focus.",
      },
      {
        day: "Thursday",
        theme: "Attention & Calm",
        focus: "Protect attention from constant notifications.",
        fitness: "Short strength or mobility set between work blocks.",
        mindfulness: "Digital boundaries for part of the day.",
        nourish: "Steady snacks to avoid energy crashes.",
      },
      {
        day: "Friday",
        theme: "Review & Celebrate",
        focus: "Look at what you completed instead of what is missing.",
        fitness: "Movement that feels rewarding, not punishing.",
        mindfulness: "Celebrate at least 1 thing you did well.",
        nourish: "Dinner that feels like a small, kind reward.",
      },
      {
        day: "Saturday",
        theme: "Light Mind, Light Body",
        focus: "Let your brain rest from overthinking.",
        fitness: "Casual movement: walking, stretching, or yoga.",
        mindfulness: "Time outside or away from screens.",
        nourish: "Gentle, comforting meals with plenty of fluids.",
      },
      {
        day: "Sunday",
        theme: "Plan & Ground",
        focus: "Create a calm, realistic plan for next week.",
        fitness: "Easy walk + soft stretching.",
        mindfulness: "3–5 simple intentions for the coming days.",
        nourish: "Early dinner and good hydration before bed.",
      },
    ],
  },
};

export default function SampleWeeklyPlan() {
  const [variantKey, setVariantKey] = useState("calm");
  const variant = WEEK_VARIANTS[variantKey];

  // ADD — modal quiz state
  const [activeQuiz, setActiveQuiz] = useState(null);

  // ADD — safe quiz modal opener
  const openQuizModal = (type) => {
    setActiveQuiz(type);
    gaEvent("weekly_plan_quiz_modal_open", { quiz: type });
    gaEvent("key_weekly_plan_quiz_modal_open", { quiz: type });
  };

  const closeQuizModal = () => setActiveQuiz(null);

  // ADD — 3 quiz types list
  const planTypes = [
    { type: "fitness", label: "Try Fitness Quiz" },
    { type: "mindfulness", label: "Try Mindfulness Quiz" },
    { type: "nourish", label: "Try Nourish Quiz" },
  ];

  // ORIGINAL tracking — untouched
  gaEvent("weekly_plan_sample_view", { variant: variantKey });
  gaEvent("key_weekly_plan_sample_view", { variant: variantKey });

  return (
    <>
      <Head>
        <title>Sample Weekly Plan | Wellness Pure Life</title>
      </Head>

      <div className={classes.page}>
        <header className={classes.header}>
          <h1 className={classes.title}>Sample Weekly Wellness Plan</h1>
          <p className={classes.subtitle}>
            This is an example of how your weekly plan could look inside{" "}
            <span>Wellness Pure Life Pro</span>. The real version adapts to your
            quiz answers and personal goals.
          </p>

          <div className={classes.topBridge}>
            <h2>Your personalized weekly plan is ready</h2>
            <p>
              Based on your quiz insights, your full adaptive plan is prepared.
              This preview shows the structure — Premium unlocks your real plan
              tailored to your goals and lifestyle.
            </p>

            <div className={classes.topBridgeButtons}>
              <Link
                href="/premium"
                className={classes.primary}
                onClick={() => {
                  gaEvent("weekly_plan_top_upgrade_click");
                  gaEvent("key_weekly_plan_top_upgrade_click");
                }}
              >
                Unlock My Full Plan
              </Link>

              <Link
                href="/quizzes/quiz-main"
                className={classes.secondary}
                onClick={() => {
                  gaEvent("weekly_plan_top_quiz_click");
                  gaEvent("key_weekly_plan_top_quiz_click");
                }}
              >
                Take Free Quiz
              </Link>
            </div>
          </div>

          <div className={classes.variantSwitch}>
            <button
              type="button"
              className={`${classes.variantButton} ${
                variantKey === "calm" ? classes.variantActive : ""
              }`}
              onClick={() => {
                gaEvent("weekly_plan_variant_select", { variant: "calm" });
                gaEvent("key_weekly_plan_variant_select", { variant: "calm" });
                setVariantKey("calm");
              }}
            >
              Calm Week
            </button>
            <button
              type="button"
              className={`${classes.variantButton} ${
                variantKey === "energy" ? classes.variantActive : ""
              }`}
              onClick={() => setVariantKey("energy")}
            >
              Energy Week
            </button>
            <button
              type="button"
              className={`${classes.variantButton} ${
                variantKey === "focus" ? classes.variantActive : ""
              }`}
              onClick={() => setVariantKey("focus")}
            >
              Focus Week
            </button>
          </div>

          <p
            className={`${classes.variantDescription} ${
              classes["accent_" + variant.accent]
            }`}
          >
            {variant.name}: {variant.description}
          </p>
        </header>

        <section className={classes.daysGrid}>
          {variant.days.map((d, idx) => (
            <article
              key={d.day}
              className={classes.dayCard}
              onMouseEnter={() => {
                gaEvent("weekly_plan_day_view", {
                  day: d.day,
                  variant: variantKey,
                });
                gaEvent("key_weekly_plan_day_view", {
                  day: d.day,
                  variant: variantKey,
                });
              }}
            >
              <div className={classes.dayHeader}>
                <span className={classes.dayBadge}>{d.day}</span>
                <span className={classes.themeLabel}>{d.theme}</span>
              </div>

              <p className={classes.focusText}>{d.focus}</p>

              <div className={classes.itemRow}>
                <p>
                  💪 <strong>Fitness:</strong> {d.fitness}
                </p>
                <p>
                  🧘 <strong>Mindfulness:</strong> {d.mindfulness}
                </p>
                <p>
                  🍎 <strong>Nourish:</strong> {d.nourish}
                </p>
              </div>
            </article>
          ))}
        </section>

        {/* NEW — Replace floating button with 3 quiz CTA */}
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

        {/* NEW — Quiz Modal */}
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
