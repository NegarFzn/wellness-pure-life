import { useEffect, useState } from "react";
import { gaEvent } from "../lib/gtag";
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

  // ---------- VIEW TRACK ----------
  useEffect(() => {
    gaEvent("daily_ritual_view");
    gaEvent("key_daily_ritual_view");
  }, []);

  // ---------- LOAD RITUAL ----------
  const loadRitual = async () => {
    try {
      const res = await fetch("/api/daily-ritual");
      const data = await res.json();

      setLocked(data.locked);
      setHasCompleted(data.hasCompleted);
      setStreak(data.streak || 0);
      if (data.message) setMessage(data.message);

      gaEvent("daily_ritual_load_success");
      gaEvent("key_daily_ritual_load_success");
    } catch (err) {
      console.error("Ritual load error", err);
      gaEvent("daily_ritual_load_fail");
      gaEvent("key_daily_ritual_load_fail");
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

  // ---------- COMPLETE RITUAL ----------
  const completeRitual = async () => {
    gaEvent("daily_ritual_complete_click");
    gaEvent("key_daily_ritual_complete_click");

    setLoading(true);

    try {
      const res = await fetch("/api/daily-ritual", { method: "POST" });
      const data = await res.json();

      setHasCompleted(true);
      setStreak(data.streak || 0);
      setShowSuccess(true);
      triggerConfetti();

      gaEvent("daily_ritual_complete_success", { streak: data.streak });
      gaEvent("key_daily_ritual_complete_success", { streak: data.streak });
    } catch (err) {
      console.error("Ritual complete failed", err);
      gaEvent("daily_ritual_complete_fail");
      gaEvent("key_daily_ritual_complete_fail");
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = Math.min((streak / 30) * 100, 100);

  const badges = [];
  if (streak >= 7) badges.push("🌟 7-Day Streak");
  if (streak >= 14) badges.push("🔥 14-Day Streak");
  if (streak >= 30) badges.push("🏆 30-Day Master");

  if (loadingRitual) return null;

  /* 🔒 Locked (Non-premium) */
  if (locked && !message) {
    gaEvent("daily_ritual_locked_view");
    gaEvent("key_daily_ritual_locked_view");

    return (
      <div className={`${classes.container} ${classes.lockedBox}`}>
        <div className={classes.lockedHeader}>
          <p className={classes.title}>🔒 Premium Feature</p>

          <div
            onClick={() => {
              gaEvent("daily_ritual_upgrade_click");
              gaEvent("key_daily_ritual_upgrade_click");
            }}
          >
            <PremiumButton />
          </div>
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

      {/* Action Button */}
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
