import { useState, useEffect } from "react";
import { gaEvent } from "../../lib/gtag";
import classes from "./PremiumCallout.module.css";
import PremiumButton from "./PremiumButton.js";

export default function PremiumCallout({ category, onDismiss }) {
  const [showModal, setShowModal] = useState(false);

  // VIEW EVENT + ANOMALY
  useEffect(() => {
    gaEvent("premium_callout_view", { category });
    gaEvent("key_premium_callout_view", { category });
  }, []);

  return (
    <div className={classes.premiumWrapper}>
      <div className={classes.premiumHeader}>
        <span className={classes.premiumBadge}>✨ Premium Access</span>

        <h2 className={classes.premiumTitle}>
          Unlock Your Full Wellness System
        </h2>

        <p className={classes.premiumText}>
          Get full access to your personalized plans, AI-powered tools,
          exclusive expert insights, and long-term progress tracking.
        </p>

        <div className={classes.premiumActions}>
          <button
            onClick={() => {
              gaEvent("premium_callout_learn_more_click", { category });
              gaEvent("key_premium_callout_learn_more_click", { category });

              gaEvent("premium_callout_modal_open", { category });
              gaEvent("key_premium_callout_modal_open", { category });

              setShowModal(true);
            }}
            className={classes.learnMoreButton}
          >
            📘 See What You Get
          </button>

          {onDismiss && (
            <button
              onClick={() => {
                gaEvent("premium_callout_dismiss", { category });
                gaEvent("key_premium_callout_dismiss", { category });

                onDismiss();
              }}
              className={classes.dismissButton}
            >
              Remind Me Later
            </button>
          )}
        </div>
      </div>

      {/* Main CTA */}
      <PremiumButton category={category} />

      {/* Modal */}
      {showModal && (
        <div
          className={classes.modalOverlay}
          onClick={() => {
            gaEvent("premium_callout_modal_close", { category });
            gaEvent("key_premium_callout_modal_close", { category });

            setShowModal(false);
          }}
        >
          <div
            className={classes.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={classes.modalTitle}>What You Unlock With Premium</h3>

            <ul className={classes.modalList}>
              <li>✅ Full weekly personalized schedules</li>
              <li>✅ AI-powered workout & recovery plans</li>
              <li>✅ Custom mindfulness + stress management</li>
              <li>✅ Smart nutrition insights</li>
              <li>✅ Progress analytics & performance reports</li>
              <li>✅ Priority access to new tools</li>
            </ul>

            <button
              className={classes.modalClose}
              onClick={() => {
                gaEvent("premium_callout_modal_close", { category });
                gaEvent("key_premium_callout_modal_close", { category });

                setShowModal(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
