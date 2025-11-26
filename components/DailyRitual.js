import { useEffect, useState } from "react";
import PremiumButton from "../components/PremiumButton/PremiumButton";
import classes from "./DailyRitual.module.css";

export default function DailyRitual() {
  const [locked, setLocked] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [message, setMessage] = useState("");
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingRitual, setLoadingRitual] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const loadRitual = async () => {
    try {
      const res = await fetch("/api/daily-ritual");
      const data = await res.json();

      setLocked(data.locked);
      setHasCompleted(data.hasCompleted);
      setStreak(data.streak || 0);
      if (data.message) setMessage(data.message);
    } catch (err) {
      console.error("Ritual load error", err);
    } finally {
      setLoadingRitual(false);
    }
  };

  useEffect(() => {
    loadRitual();
  }, []);

  const triggerConfetti = () => {
    const confetti = document.createElement("div");
    confetti.className = classes.confetti;
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 1200);
  };

  const completeRitual = async () => {
    setLoading(true);

    const res = await fetch("/api/daily-ritual", { method: "POST" });
    const data = await res.json();

    setHasCompleted(true);
    setStreak(data.streak || 0);
    setShowSuccess(true);
    triggerConfetti();

    setLoading(false);
  };

  const progressPercent = Math.min((streak / 30) * 100, 100);

  const badges = [];
  if (streak >= 7) badges.push("🌟 7-Day Streak");
  if (streak >= 14) badges.push("🔥 14-Day Streak");
  if (streak >= 30) badges.push("🏆 30-Day Master");

  if (loadingRitual) return null;

  /* 🔒 Locked (Non-premium) */
  if (locked && !message) {
    return (
      <div className={`${classes.container} ${classes.lockedBox}`}>
        <div className={classes.lockedHeader}>
          <p className={classes.title}>🔒 Premium Feature</p>
          <PremiumButton />
        </div>

        <p className={classes.premiumText}>
          Daily Rituals help build calm, focus and healthy habits.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${classes.container} ${
        showSuccess ? classes.successBox : ""
      }`}
    >
      <p className={classes.title}>🌤 Your Daily Ritual</p>

      {/* Ritual Text always visible */}
      <p className={classes.ritualText}>{message}</p>

      {/* Emotional Reward */}
      {hasCompleted && (
        <p className={classes.successText}>
          🌿 You kept your promise to yourself today. That matters.
        </p>
      )}

      {/* Action / Passive Completion */}
      {!hasCompleted ? (
        <button
          onClick={completeRitual}
          className={classes.completeBtn}
          disabled={loading}
        >
          {loading ? "Saving..." : "✓ Mark as done"}
        </button>
      ) : (
        <div className={classes.completedTag}>✓ Completed</div>
      )}

      {/* Progress */}
      <div className={classes.progressBarWrap}>
        <div
          className={classes.progressBarFill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Streak */}
      <p className={classes.streak}>🔥 {streak} day streak</p>

      {/* Badges */}
      {badges.length > 0 && (
        <div className={classes.badges}>
          {badges.map((b, i) => (
            <div key={i} className={classes.badgeAnimated}>
              {b}
            </div>
          ))}
        </div>
      )}

      {/* Habit loop teaser */}
      {hasCompleted && (
        <p style={{ fontSize: "0.85rem", opacity: 0.6 }}>
          🌙 Tomorrow’s ritual unlocks soon.
        </p>
      )}
    </div>
  );
}
