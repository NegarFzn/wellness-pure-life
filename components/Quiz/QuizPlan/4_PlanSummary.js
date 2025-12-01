import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import PremiumButton from "../../PremiumButton/PremiumButton";
import ShareButton from "../../UI/ShareButton";
import classes from "./PlanSummary.module.css";
import Button from "../../UI/button";

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
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const saveCalled = useRef(false);

  const category = slug?.replace("-plan", "");
  const finalAnswers = loadedAnswers || answers;

  // ✅ Premium flag
  const isPremium = !!session?.user?.isPremium;

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
        setMatchedPlan(data.matchedPlan || null);
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
        setMatchedPlan(data.matchedPlan);
      } catch (err) {
        console.error("❌ Failed to fetch saved plan:", err);
      }
    };

    fetchSavedPlan();
  }, [session?.user?.email, status, slug]);

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
      const res = await fetch("/api/quiz/sendEmail-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          answers: finalAnswers,
          category,
          matchedPlan,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMsg("📧 Plan sent to your email.");
        setEmailSent(true);
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

  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>
        Your Personalized{" "}
        {category?.charAt(0).toUpperCase() + category?.slice(1)} Plan
      </h2>

      {matchedPlan?.summary && (
        <p className={classes.subheading}>{matchedPlan.summary}</p>
      )}

      {/* ✅ UTILITY BUTTONS – PREMIUM ONLY */}
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
                disabled={isSending || emailSent}
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

      {/* ✅ PREMIUM ONLY CONTENT */}
      {isPremium && (
        <>
          <div className={classes.summaryList}>
            {questions.map((q) => (
              <div key={q.key} style={{ marginBottom: "0.5rem" }}>
                <p>
                  <strong>{q.question}</strong>:{" "}
                  {formatLabel(finalAnswers[q.key]) || "N/A"}
                </p>
              </div>
            ))}
          </div>

          {matchedPlan?.structure && (
            <div style={{ marginTop: "1rem" }}>
              <strong>Plan Structure:</strong>
              <ul>
                {matchedPlan.structure.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* ✅ PREMIUM SOFT TRIGGER */}
      {!isPremium && session?.user && (
        <>
          <div className={classes.lockPreviewBox}>
            <h3 className={classes.lockTitle}>
              ✨ Your personalized plan is ready
            </h3>

            <p className={classes.lockText}>
              You can preview your plan now, and unlock the full detailed
              version anytime you feel ready.
            </p>

            <button
              className={classes.unlockButton}
              onClick={() => setShowPremiumModal(true)}
            >
              Preview My Plan
            </button>
          </div>

          {/* ✅ SOFT PREMIUM MODAL */}
          {showPremiumModal && (
            <div
              className={classes.modalOverlay}
              onClick={() => setShowPremiumModal(false)}
            >
              <div
                className={classes.modalBox}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className={classes.modalTitle}>
                  ✨ Your full wellness plan is available
                </h3>

                <p className={classes.modalText}>
                  Your personalized plan is ready. Premium members can unlock
                  full guidance, advanced progress tracking, and expert-level
                  features at any time.
                </p>

                <div className={classes.modalAction}>
                  <PremiumButton category={category} />
                </div>

                <button
                  className={classes.modalClose}
                  onClick={() => setShowPremiumModal(false)}
                >
                  View basic version for now
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 📘 Blog CTA */}
      <div className={classes.blogCtaWrap}>
        <p className={classes.premiumNote}>
          ✨ Want deeper guidance? <br />
          <span>
            Full access to all personalized wellness guides is part of our
            Premium Membership. You can continue exploring the free version, or
            upgrade anytime you feel ready.
          </span>
        </p>

        <a href="/blog" className={classes.blogCta}>
          Explore More Wellness Guides →
        </a>
      </div>

      {toastMsg && <div className={classes.toastBox}>{toastMsg}</div>}

      {submitted && (
        <p className={classes.successMessage}>✔️ Your plan has been saved.</p>
      )}
    </div>
  );
}
