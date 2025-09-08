import { useState } from "react";
import classes from "./PremiumCallout.module.css";
import PremiumButton from "./PremiumButton.js";

export default function PremiumCallout({ category, onDismiss }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={classes.premiumWrapper}>
      <div className={classes.premiumHeader}>
        <span className={classes.premiumBadge}>✨ Premium</span>
        <p className={classes.premiumText}>
          <strong>Unlock Premium</strong> to access your full weekly schedule,
          personalized workouts, and exclusive expert guidance.
        </p>
        <div className={classes.premiumActions}>
          <button
            onClick={() => setShowModal(true)}
            className={classes.learnMoreButton}
          >
            📋 Learn More
          </button>
          <button onClick={onDismiss} className={classes.dismissButton}>
            🔕 Remind Me Later
          </button>
        </div>
      </div>

      <PremiumButton category={category} />

      {showModal && (
        <div
          className={classes.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={classes.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={classes.modalTitle}>What's Included in Premium</h3>
            <ul className={classes.modalList}>
              <li>📅 Weekly structured fitness schedule</li>
              <li>🧠 Mindfulness routines and reminders</li>
              <li>🍎 Personalized nutrition insights</li>
              <li>📈 Progress tracking & analytics</li>
              <li>💬 Expert tips curated weekly</li>
              <li>🔓 Access to all future premium features</li>
            </ul>
            <button
              className={classes.modalClose}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
