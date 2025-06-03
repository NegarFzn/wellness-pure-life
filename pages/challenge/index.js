import { useEffect, useState } from "react";
import classes from "./index.module.css";

export default function ChallengePage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dayNumber, setDayNumber] = useState(1);
  const [completedDays, setCompletedDays] = useState([]);
  const [completedKey, setCompletedKey] = useState("completedDays_default");
  const [showResetModal, setShowResetModal] = useState(false);

  const handleResetProgress = () => {
    const storedStart = localStorage.getItem("challengeStartDate");
    if (storedStart) {
      localStorage.removeItem(`completedDays_${storedStart}`);
    }
    localStorage.removeItem("challengeStartDate");
    localStorage.removeItem("dailyChallenge");

    setCompletedDays([]);
    setDayNumber(1);
    setChallenges([]);
    setLoading(true);
    location.reload();
  };

  // Handle challenge date, reset if expired, setup completed key
  useEffect(() => {
    const getLocalMidnight = (date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
    const todayMidnight = getLocalMidnight(new Date());
  
    let storedStart = localStorage.getItem("challengeStartDate");
    let startDateMidnight;
  
    if (!storedStart) {
      // First-time user
      const isoStart = todayMidnight.toISOString();
      localStorage.setItem("challengeStartDate", isoStart);
      storedStart = isoStart;
      startDateMidnight = todayMidnight;
    } else {
      // Returning user
      const parsedStart = new Date(storedStart);
      startDateMidnight = getLocalMidnight(parsedStart);
    }
  
    const diffInDays = Math.floor(
      (todayMidnight - startDateMidnight) / (1000 * 60 * 60 * 24)
    );
  
    if (diffInDays >= 7) {
      // Automatic reset
      const newStart = todayMidnight.toISOString();
      localStorage.setItem("challengeStartDate", newStart);
      localStorage.removeItem(`completedDays_${storedStart}`);
      localStorage.removeItem("dailyChallenge");
  
      setCompletedDays([]);
      setDayNumber(1);
      setCompletedKey(`completedDays_${newStart}`);
    } else {
      setDayNumber(Math.min(7, diffInDays + 1));
      const key = `completedDays_${storedStart}`;
      setCompletedKey(key);
  
      const storedCompleted = localStorage.getItem(key);
      if (storedCompleted) {
        setCompletedDays(JSON.parse(storedCompleted));
      }
    }
  }, []);
  

  // Load challenges
  useEffect(() => {
    const todayKey = new Date().toISOString().split("T")[0];
    const cached = localStorage.getItem("dailyChallenge");

    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.date === todayKey && Array.isArray(parsed.challenges)) {
        setChallenges(parsed.challenges);
        setLoading(false);
        return;
      }
    }

    fetch("/api/challenge")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.challenges)) {
          setChallenges(data.challenges);
          localStorage.setItem(
            "dailyChallenge",
            JSON.stringify({ date: todayKey, challenges: data.challenges })
          );
        } else {
          setChallenges(["⚠️ Unexpected challenge format."]);
        }
        setLoading(false);
      })
      .catch(() => {
        setChallenges(["⚠️ Failed to load today's challenge."]);
        setLoading(false);
      });
  }, []);

  const toggleComplete = (dayIndex) => {
    const newCompleted = completedDays.includes(dayIndex)
      ? completedDays.filter((d) => d !== dayIndex)
      : [...completedDays, dayIndex];

    setCompletedDays(newCompleted);
    localStorage.setItem(completedKey, JSON.stringify(newCompleted));
  };

  const getEmojiForChallenge = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes("water")) return "💧";
    if (lower.includes("meditate") || lower.includes("mindful")) return "🧘";
    if (
      lower.includes("walk") ||
      lower.includes("outdoor") ||
      lower.includes("step")
    )
      return "🚶‍♂️";
    if (lower.includes("sleep") || lower.includes("bed")) return "🛌";
    if (lower.includes("breathe") || lower.includes("breathing")) return "🌬️";
    if (lower.includes("journal") || lower.includes("write")) return "📓";
    if (lower.includes("stretch")) return "🧘‍♂️";
    if (lower.includes("exercise") || lower.includes("workout")) return "🏋️";
    if (lower.includes("grateful") || lower.includes("gratitude")) return "🙏";
    if (lower.includes("fruit") || lower.includes("vegetable")) return "🍎";

    return "🌟";
  };

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsbygoogle error:", e);
    }
  }, []);

  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>Your 7-Day Wellness Challenge</h1>
      <p className={classes.subtext}>
        These challenges are generated just for you by ChatGPT:
      </p>

      <div className={classes.progressBar}>
        <div
          className={classes.progressFill}
          style={{ width: `${(completedDays.length / 7) * 100}%` }}
        />
      </div>
      <p className={classes.progressText}>
        {completedDays.length}/7 Days Complete
      </p>

      {/* ✅ Google AdSense block here */}
      <div className={classes.adContainer}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-6324625824043093"
          data-ad-slot="YOUR_AD_SLOT_TOP"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>

      <button
        className={classes.resetButton}
        onClick={() => setShowResetModal(true)}
      >
        🔄 Reset Progress
      </button>

      {loading ? (
        <p className={classes.loading}>Loading your challenges...</p>
      ) : (
        <ol className={classes.challengeList}>
          {challenges.map((item, index) => {
            const isToday = index + 1 === dayNumber;
            const isComplete = completedDays.includes(index);
            const emoji = getEmojiForChallenge(item);

            return (
              <li
                key={index}
                className={`${classes.challengeItem} ${
                  isToday ? classes.currentDay : ""
                } ${isComplete ? classes.completed : ""}`}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={isComplete}
                    onChange={() => toggleComplete(index)}
                  />
                  <span className={classes.checkboxLabel}>
                    {emoji} <strong>Day {index + 1}:</strong> {item}
                  </span>
                </label>
              </li>
            );
          })}
        </ol>
      )}

      {/* ✅ Custom Modal */}
      {showResetModal && (
        <div className={classes.modalOverlay}>
          <div className={classes.modalContent}>
            <p>Are you sure you want to reset your challenge progress?</p>
            <div className={classes.modalActions}>
              <button onClick={handleResetProgress}>Yes, Reset</button>
              <button onClick={() => setShowResetModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
