import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import PremiumCallout from "../../PremiumButton/PremiumCallout";
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

  const saveCalled = useRef(false); // 🔒 lock to avoid duplicate save

  const category = slug?.replace("-plan", "");
  const finalAnswers = loadedAnswers || answers;

  // ⏬ Build label map from provided questions
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

  // ✅ Save answers (only once, at the end)
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email || !answers) return;
    if (saveCalled.current) return; // ⛔ already saved once

    saveCalled.current = true; // mark as saved

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
        console.log("✅ Plan saved:", data);
      } catch (err) {
        console.error("❌ Failed to save quiz result:", err);
      }
    };

    save();
  }, [answers, status, slug, session?.user?.email]);

  // ✅ Load saved plan (so we can display matched structure/summary)
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

  // ✅ Check premium reminder
  useEffect(() => {
    const checkShouldShowPremium = async () => {
      if (session?.user && !session.user.isPremium) {
        try {
          const res = await fetch(`/api/premium-reminder?category=${category}`);
          const data = await res.json();
          setShowPremium(data.show);
        } catch (err) {
          console.error("❌ Failed to check premium reminder:", err);
          setShowPremium(false);
        }
      }
    };

    checkShouldShowPremium();
  }, [session?.user, session?.user?.isPremium, category]);

  // ✅ Email plan
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
      console.error("❌ Email send error:", err);
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

      {!session?.user && (
        <p style={{ marginTop: "1rem" }}>
          Want to save this plan permanently?{" "}
          <Button size="sm" onClick={() => router.push("/login")}>
            Log in or Sign up
          </Button>
        </p>
      )}

      {session?.user && !session.user.isPremium && showPremium && (
        <PremiumCallout
          category={category}
          onDismiss={async () => {
            await fetch(`/api/premium-reminder?category=${category}`, {
              method: "POST",
            });
            setShowPremium(false);
          }}
        />
      )}

      {toastMsg && <div className={classes.toastBox}>{toastMsg}</div>}
      {submitted && (
        <p className={classes.successMessage}>✔️ Your plan has been saved.</p>
      )}
    </div>
  );
}
