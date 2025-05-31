import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import classes from "./ChallengeBox.module.css";

export default function ChallengeBox({ onLinkClick }) {
  const [challengeText, setChallengeText] = useState("Loading...");
  const [dayNumber, setDayNumber] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const today = new Date();
    const storedStart = localStorage.getItem("challengeStartDate");
    const startDate = storedStart ? new Date(storedStart) : today;

    if (!storedStart) {
      localStorage.setItem("challengeStartDate", today.toISOString());
    }

    const diffInDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    setDayNumber(Math.min(7, diffInDays + 1));

    handleNewTip();
  }, []);

  const handleSeeFullChallenge = () => {
    const dropdown = document.querySelector(`.${classes.megaDropdown}`);
    if (dropdown) dropdown.style.display = "none";
    if (onLinkClick) onLinkClick();
    router.push("/challenge");
  };

  const handleNewTip = async () => {
    if (typeof window === "undefined") return;

    setChallengeText("Loading...");

    try {
      let tips = JSON.parse(localStorage.getItem("cachedTips") || "[]");
      let index = parseInt(localStorage.getItem("tipIndex") || "0", 10);

      // If tips exhausted or empty, fetch new tips
      if (tips.length === 0 || index >= tips.length) {
        const res = await fetch("/api/challenge");
        const data = await res.json();
        tips = data.tips || [];
        index = 0;

        // Save new tips to localStorage
        localStorage.setItem("cachedTips", JSON.stringify(tips));
      }

      const nextTip = tips[index] || "🌟 Stay strong!";
      setChallengeText(nextTip);

      // Update index for next tip
      localStorage.setItem("tipIndex", (index + 1).toString());
    } catch (err) {
      console.error("Error loading tips:", err);
      setChallengeText("Try something new today!");
      toast.error("⚠️ Could not load a new tip. Please try again.");
    }
  };

  return (
    <div className={classes.challengeColumn}>
      <div className={classes.challengeBox}>
        <div className={classes.challengeHeader}>
          <span className={classes.challengeIcon}>🔥</span>
          <h5 className={classes.challengeTitle}>7-Day Challenge</h5>
        </div>
        <p className={classes.challengeDay}>Day {dayNumber} of 7</p>
        <p className={classes.challengeText}>{challengeText}</p>
        <Link href="/challenge" legacyBehavior>
          <a className={classes.challengeLink} onClick={handleSeeFullChallenge}>
            See Full Challenge →
          </a>
        </Link>
        <button
          onClick={handleNewTip}
          className={classes.refreshButton}
          aria-label="Regenerate daily challenge"
        >
          🔄 New Tip
        </button>
      </div>
    </div>
  );
}
