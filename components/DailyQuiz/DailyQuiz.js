import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import classes from "./DailyQuiz.module.css";

export default function DailyQuiz({ onClose }) {
  // quiz state 
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [savedLocally, setSavedLocally] = useState(false);

  // visibility and flow state
  const [visible, setVisible] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const { status, data: session } = useSession();
  const isLoggedIn = status === "authenticated";
  const router = useRouter();
  const mountedRef = useRef(false);

  // Decide initial step
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (isLoggedIn) {
        setShowQuiz(true);
      } else {
        setShowPrompt(true);
      }
      return;
    }
    if (visible && isLoggedIn) {
      setShowPrompt(false);
      setShowQuiz(true);
    }
  }, [isLoggedIn, visible]);

  // Close on Esc
  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  // ---- Quiz submit ----
  const handleSubmit = async () => {
    if (!answer) return;

    if (isLoggedIn) {
      try {
        const res = await fetch("/api/quizzes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: "daily-quiz",
            quizSlug: "daily-quiz",
            isDaily: true,
            result: answer,
            answers: [answer],
            // Always send something, even if email missing from session
            email: session?.user?.email || "",
          }),
        });

        if (!res.ok) {
          const txt = await res.text();
          console.error("DailyQuiz save failed:", res.status, txt);
          throw new Error(`Save failed: ${res.status}`);
        }

        setSubmitted(true);
        setTimeout(() => handleClose(), 2000);
      } catch (e) {
        console.warn("Falling back to local save:", e.message);
        const today = new Date().toISOString().split("T")[0];
        try {
          localStorage.setItem(
            `daily-checkin:${today}`,
            JSON.stringify({ answer, at: Date.now() })
          );
        } catch {}
        setSavedLocally(true);
        setSubmitted(true);
      }
    } else {
      const today = new Date().toISOString().split("T")[0];
      try {
        localStorage.setItem(
          `daily-checkin:${today}`,
          JSON.stringify({ answer, at: Date.now() })
        );
        localStorage.removeItem("openDailyQuizAfterLogin");
      } catch {}
      setSavedLocally(true);
      setSubmitted(true);
    }
  };

  // Sync local answers after login
  useEffect(() => {
    if (!submitted || !isLoggedIn) return;

    const syncLocalIfExists = async () => {
      if (typeof window === "undefined") return;

      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("daily-checkin:")) keys.push(k);
      }
      if (keys.length === 0) return;

      try {
        for (const key of keys) {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const { answer: localAnswer } = JSON.parse(raw) || {};
          if (!localAnswer) continue;

          const res = await fetch("/api/quizzes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug: "daily-quiz",
              quizSlug: "daily-quiz",
              isDaily: true,
              result: localAnswer,
              answers: [localAnswer],
              email: session?.user?.email || "",
            }),
          });

          if (res.ok) {
            localStorage.removeItem(key);
          } else {
            const txt = await res.text();
            console.error("DailyQuiz sync failed:", res.status, txt);
          }
        }
        handleClose();
      } catch (err) {
        console.error("DailyQuiz sync error:", err);
      }
    };

    syncLocalIfExists();
  }, [submitted, isLoggedIn, session?.user?.email]);

  // ---- Helpers ----
  const handleClose = () => {
    setVisible(false);
    setShowPrompt(false);
    setShowQuiz(false);
    if (onClose) onClose();
  };

  const gotoLogin = () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const hasGuestSubmission = !!localStorage.getItem(
        `daily-checkin:${today}`
      );
      if (!hasGuestSubmission && !submitted) {
        localStorage.setItem("openDailyQuizAfterLogin", "true");
      }
    } catch {}
    handleClose();
    setTimeout(() => router.push("/login"), 250);
  };

  if (!visible) return null;

  return (
    <div
      className={classes.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={classes.box}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dq-title"
      >
        {showPrompt && !showQuiz && (
          <div className={classes.centered}>
            <h2 id="dq-title" className={classes.h2}>
              📝 Want today’s Daily Quiz?
            </h2>
            <p className={classes.subtle}>
              Log in to save your result and track trends, or continue as a
              guest.
            </p>
            <div className={classes.actionsRow}>
              <button className={classes.secondaryBtn} onClick={handleClose}>
                Not now
              </button>
              <button
                className={classes.secondaryBtn}
                onClick={() => setShowQuiz(true)}
              >
                Continue as guest
              </button>
              <button className={classes.submitBtn} onClick={gotoLogin}>
                Login
              </button>
            </div>
          </div>
        )}

        {showQuiz &&
          (!submitted ? (
            <>
              <h2 id="dq-title" className={classes.h2}>
                🗓️ How are you feeling today?
              </h2>
              <select
                className={classes.select}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              >
                <option value="">Select your mood</option>
                <option value="High Stress">😣 High Stress</option>
                <option value="Balanced">🙂 Balanced</option>
                <option value="Low Stress">😌 Low Stress</option>
              </select>
              <div className={classes.actionsRow}>
                <button className={classes.submitBtn} onClick={handleSubmit}>
                  Submit
                </button>
                <button className={classes.secondaryBtn} onClick={handleClose}>
                  Close
                </button>
              </div>
            </>
          ) : isLoggedIn ? (
            <p className={classes.thankYou}>✅ Thanks for checking in!</p>
          ) : (
            <div className={classes.centered}>
              <p className={classes.thankYou}>✅ Thanks for checking in!</p>
              {savedLocally && (
                <p className={classes.subtle}>
                  We saved this on your device. Log in to sync and track trends.
                </p>
              )}
              <div className={classes.actionsRow}>
                <button className={classes.secondaryBtn} onClick={handleClose}>
                  Close
                </button>
                <button className={classes.submitBtn} onClick={gotoLogin}>
                  Login to sync
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
