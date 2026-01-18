import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import PremiumButton from "../../PremiumButton/PremiumButton";
import ShareButton from "../../UI/ShareButton";
import { gaEvent } from "../../../lib/gtag";
import classes from "./PlanSummary.module.css";

export default function MultiPlanSummary({ answers, questions = [], slug }) {
  const [showPremium, setShowPremium] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [submitted, setSubmitted] = useState(false);
  const [loadedAnswers, setLoadedAnswers] = useState(null);
  const [labelMap, setLabelMap] = useState({});
  const [matchedPlan, setMatchedPlan] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const saveCalled = useRef(false);
  const category = slug?.replace("-plan", "");
  const finalAnswers = loadedAnswers || answers;
  const isPremium = !!session?.user?.isPremium;

  useEffect(() => {
    if (!session?.user?.isPremium) {
      gaEvent("premium_upsell_shown", { slug, category });
    }
  }, [session?.user?.isPremium, slug, category]);

  /* -------------------- Label map -------------------- */
  useEffect(() => {
    if (questions.length > 0) {
      const map = {};
      questions.forEach((q) => {
        q.options.forEach((opt) => {
          map[opt.value] = opt.label;
        });
      });
      setLabelMap(map);
    }
  }, [questions]);

  const formatLabel = (val) => labelMap[val] || val;

  /* -------------------- Save answers -------------------- */
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email || !answers) return;
    if (saveCalled.current) return;

    saveCalled.current = true;

    const save = async () => {
      try {
        sessionStorage.setItem(`${slug}_plan_answers`, JSON.stringify(answers));

        const res = await fetch("/api/quiz/quiz-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            answers,
            email: session.user.email,
          }),
        });

        const data = await res.json();
        setSubmitted(true);
        setMatchedPlan(data.result?.matchedPlan || null);
      } catch (err) {
        console.error("❌ Failed to save quiz result:", err);
      }
    };

    save();
  }, [answers, status, slug, session?.user?.email]);

  /* -------------------- Load saved plan -------------------- */
  useEffect(() => {
    if (status !== "authenticated" || !slug || !session?.user?.email) return;

    const fetchSavedPlan = async () => {
      try {
        const res = await fetch(
          `/api/quiz/quiz-plan?slug=${slug}&email=${encodeURIComponent(
            session.user.email
          )}`
        );
        if (!res.ok) return;

        const data = await res.json();
        setLoadedAnswers(data.answers);
        setMatchedPlan(data.matchedPlan || null);
      } catch (err) {
        console.error("❌ Failed to fetch saved plan:", err);
      }
    };

    fetchSavedPlan();
  }, [session?.user?.email, status, slug]);

  useEffect(() => {
    if (!matchedPlan) return;

    gaEvent("quiz_completed", {
      slug,
      category,
      plan_type: matchedPlan?.type || "default",
      plan_id: matchedPlan?.id || null,
    });
  }, [matchedPlan]);

  /* -------------------- Premium reminder -------------------- */
  useEffect(() => {
    const checkShouldShowPremium = async () => {
      if (session?.user && !session.user.isPremium) {
        try {
          const res = await fetch(`/api/premium-reminder?category=${category}`);
          const data = await res.json();
          setShowPremium(data.show);
        } catch (err) {
          setShowPremium(false);
        }
      }
    };

    checkShouldShowPremium();
  }, [session?.user, session?.user?.isPremium, category]);

  /* -------------------- Email plan -------------------- */
  const sendPlanToEmail = async () => {
    setIsSending(true);
    setToastMsg("");

    try {
      console.log("DEBUG-EMAIL matchedPlan =", matchedPlan);

      const res = await fetch("/api/quiz/quiz-plan?mode=email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          answers: finalAnswers,
          category,
          matchedPlan,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMsg("📧 Plan sent to your email.");
        setEmailSent(true);

        gaEvent("quiz_plan_emailed", {
          slug,
          category,
          email: session.user.email,
        });
      } else {
        setToastMsg("❌ Failed to send email: " + data.error);
      }
    } catch (err) {
      setToastMsg("❌ Failed to send email.");
    } finally {
      setIsSending(false);
      setTimeout(() => setToastMsg(""), 4000);
    }
  };

  // ---------------------------------------------------------
  // DYNAMIC FREE RECOMMENDATION ENGINE (QUIZ-MAIN)
  // ---------------------------------------------------------
  const generateFreeRecommendations = (answers) => {
    if (!answers) return [];

    const recs = [];
    const goal = answers.goal;
    const challenge = answers.challenge;
    const energy = answers.energy;
    const activity = answers.activityLevel;
    const mood = answers.mood;

    // -----------------------------
    // RULE 1 — Stress / Overwhelm
    // -----------------------------
    if (
      mood === "stressed" ||
      challenge === "stress" ||
      challenge === "anxiety"
    ) {
      recs.push({
        title: "🧘 Calm Mind & Stress Check",
        slug: "stress-check",
        description: "Reduce stress and discover techniques to calm your mind.",
        score: 10,
      });
    }

    // -----------------------------
    // RULE 2 — Low Energy / Fatigue
    // -----------------------------
    if (challenge === "low_energy" || energy === "low") {
      recs.push({
        title: "🌅 Morning Rituals for Energy",
        slug: "morning-energy",
        description: "Boost energy naturally with simple morning practices.",
        score: 9,
      });
    }

    // -----------------------------
    // RULE 3 — Stiffness / Mobility / Desk Life
    // -----------------------------
    if (
      challenge === "stiffness" ||
      activity === "sedentary" ||
      goal === "flexibility"
    ) {
      recs.push({
        title: "🤸 10-Minute Mobility Flow",
        slug: "mobility",
        description:
          "Improve mobility and reduce tension with short movements.",
        score: 9,
      });
    }

    // -----------------------------
    // RULE 4 — Muscle Building
    // -----------------------------
    if (goal === "build_muscle") {
      recs.push({
        title: "💪 How to Build Muscle Safely",
        slug: "build-muscle",
        description:
          "Learn the fundamentals of safe, effective strength building.",
        score: 9,
      });
    }

    // -----------------------------
    // RULE 5 — Weight Loss
    // -----------------------------
    if (goal === "lose_weight") {
      recs.push({
        title: "🔥 Smart Eating Habits",
        slug: "nutrition",
        description:
          "Discover eating patterns that support balanced weight loss.",
        score: 8,
      });
    }

    // -----------------------------
    // RULE 6 — Life Balance
    // -----------------------------
    if (challenge === "time_management" || mood === "overwhelmed") {
      recs.push({
        title: "⚖ Life Balance Quiz",
        slug: "life-balance",
        description:
          "Check your balance between work, rest, habits, and wellbeing.",
        score: 8,
      });
    }

    // If no rules matched, fall back to general wellness quizzes
    if (!recs || recs.length === 0) {
      return [
        {
          title: "🧘 Calm Mind & Stress Check",
          slug: "stress-check",
          description: "Reset your mind with quick mindfulness insights.",
        },
        {
          title: "🍽 Nutrition Habits Quiz",
          slug: "nutrition",
          description: "Discover how to improve your daily eating habits.",
        },
        {
          title: "⚖ Life Balance Quiz",
          slug: "life-balance",
          description: "Evaluate your lifestyle balance.",
        },
      ];
    }

    // Sort by score, highest first
    recs.sort((a, b) => b.score - a.score);

    // Return first 3 unique quizzes
    const unique = [];
    const used = new Set();

    for (let r of recs) {
      if (!used.has(r.slug)) {
        unique.push(r);
        used.add(r.slug);
      }
      if (unique.length === 3) break;
    }

    return unique;
  };

  const freeRecs = generateFreeRecommendations(finalAnswers);
  // ⛔ Prevent freeRecs from running before answers exist
  if (!finalAnswers || Object.keys(finalAnswers).length === 0) {
    return (
      <div className={classes.pageBg}>
        <div className={classes.container}>
          <p>Loading your personalized plan...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!finalAnswers) return;

    Object.entries(finalAnswers).forEach(([key, value]) => {
      gaEvent("quiz_question_answered", {
        slug,
        category,
        question_key: key,
        answer_value: value,
      });
    });
  }, [finalAnswers]);

  return (
    <div className={classes.pageBg}>
      <div className={classes.container}>
        {/* HEADER */}
        <h2 className={classes.title}>
          Your Personalized{" "}
          {category?.charAt(0).toUpperCase() + category?.slice(1)} Plan
        </h2>

        {matchedPlan?.summary && (
          <p className={classes.subtitle}>{matchedPlan.summary}</p>
        )}

        {/* PREMIUM UTILITY BUTTONS */}
        {isPremium && (
          <div className={classes.actionsRow}>
            <div className={classes.utilityButtons}>
              <button
                className={`${classes.utilityButton} ${classes.secondaryButton}`}
                onClick={() => window.print()}
              >
                🖨️ Print
              </button>

              <ShareButton
                title="My Personalized Wellness Plan"
                text="Check out my personalized wellness plan based on my preferences at Wellness Pure Life."
                url={`https://wellnesspurelife.com${router.asPath}`}
              />

              {session?.user?.email && (
                <button
                  className={`${classes.utilityButton} ${classes.secondaryButton}`}
                  disabled={isSending || !finalAnswers}
                  onClick={sendPlanToEmail}
                >
                  {isSending
                    ? "Sending..."
                    : emailSent
                    ? "✅ Sent"
                    : "📧 Send to Email"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* PREMIUM CONTENT */}
        {isPremium && (
          <>
            {/* SUMMARY CARD */}
            <div className={classes.summaryCard}>
              <h3>Your Profile Summary</h3>
              <ul>
                {questions.map((q) => (
                  <li key={q.key}>
                    <strong>{q.question}</strong>:{" "}
                    {formatLabel(finalAnswers[q.key]) || "N/A"}
                  </li>
                ))}
              </ul>
            </div>

            {/* STRUCTURE */}
            {matchedPlan?.structure && (
              <div className={classes.structureCard}>
                <h3>Plan Structure</h3>
                <ul>
                  {matchedPlan.structure.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* PREMIUM SOFT TRIGGER */}
        {!isPremium && session?.user && (
          <div className={classes.premiumCard}>
            <h3 className={classes.premiumTitle}>
              Unlock Your Full Fitness Plan
            </h3>

            <p className={classes.premiumText}>
              Access your complete structured weekly plan, detailed routines,
              progression guidance, and personalized recommendations.
            </p>

            <PremiumButton
              category={category}
              onClick={() =>
                gaEvent("premium_upgrade_click", { slug, category })
              }
            />

            <p className={classes.premiumNote}>
              No commitment — continue using the free version anytime.
            </p>
          </div>
        )}

        {/* FREE CONTENT — DYNAMIC NEXT STEPS */}
        <div className={`${classes.freeSection} ${classes.fadeIn}`}>
          <h4 className={classes.freeTitle}>
            Continue Your Wellness Journey (Free)
          </h4>

          {freeRecs.map((rec, i) => (
            <a
              key={i}
              href={`/quizzes/quiz-main/${rec.slug}`}
              className={classes.freeCard}
              onClick={() =>
                gaEvent("free_recommendation_click", {
                  slug,
                  category,
                  next_quiz: rec.slug,
                })
              }
            >
              <div className={classes.freeCardTitle}>{rec.title} →</div>

              <p className={classes.freeDescription}>{rec.description}</p>
            </a>
          ))}

          <p className={classes.freeCaption}>
            These suggestions are personalized based on your answers.
          </p>
        </div>

        {toastMsg && <div className={classes.toastBox}>{toastMsg}</div>}
      </div>
    </div>
  );
}
