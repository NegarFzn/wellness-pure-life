import { useEffect, useState } from "react";
import classes from "./DailyRitual.module.css";

export default function DailyRitual() {
  const [locked, setLocked] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(true);
  const [message, setMessage] = useState("");
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingRitual, setLoadingRitual] = useState(true);

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

  const completeRitual = async () => {
    setLoading(true);

    const res = await fetch("/api/daily-ritual", { method: "POST" });
    const data = await res.json();

    setLocked(false);
    setHasCompleted(true);
    setStreak(data.streak || 0);

    setLoading(false);
  };

  const progressPercent = Math.min((streak / 30) * 100, 100);

  const badges = [];
  if (streak >= 7) badges.push("🌟 7-Day Streak");
  if (streak >= 14) badges.push("🔥 14-Day Streak");
  if (streak >= 30) badges.push("🏆 30-Day Master");

  if (loadingRitual) return null;

  /* 🔒 Locked (non-premium from API) */
  if (locked && !hasCompleted && !message) {
    return (
      <div className={`${classes.container} ${classes.lockedBox}`}>
        <p className={classes.title}>🔒 Premium Feature</p>
        <p className={classes.premiumText}>
          Daily Rituals help build calm, focus and healthy habits.
        </p>
      </div>
    );
  }

  /* ✅ COMPLETED STATE (NOW SHOWS RITUAL TEXT) */
  if (hasCompleted) {
    return (
      <div className={`${classes.container} ${classes.lockedBox}`}>
        <p className={classes.title}>✅ Ritual Completed</p>

        <p className={classes.ritualText}>{message}</p>
        <p style={{ opacity: 0.7, fontSize: "0.85rem" }}>
          ✅ Completed for today
        </p>

        <div className={classes.progressBarWrap}>
          <div
            className={classes.progressBarFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className={classes.streak}>🔥 {streak} day streak</p>

        {badges.length > 0 && (
          <div className={classes.badges}>
            {badges.map((b, i) => (
              <div key={i} className={classes.badge}>
                {b}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* 🌤 ACTIVE RITUAL */
  return (
    <div className={classes.container}>
      <p className={classes.title}>🌤 Your Daily Ritual</p>
      <p className={classes.ritualText}>{message}</p>

      <button
        onClick={completeRitual}
        className={classes.completeBtn}
        disabled={loading || hasCompleted}
        style={{ marginTop: "12px" }}
      >
        {hasCompleted
          ? "✓ Completed"
          : loading
          ? "Saving..."
          : "✓ Mark as done"}
      </button>

      <div className={classes.progressBarWrap}>
        <div
          className={classes.progressBarFill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className={classes.streak}>🔥 {streak} day streak</p>

      {badges.length > 0 && (
        <div className={classes.badges}>
          {badges.map((b, i) => (
            <div key={i} className={classes.badge}>
              {b}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
