import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import classes from "./Step.module.css";

export default function MultiSummaryStep({
  onBack,
  onNext,
  answers,
  slug,
  questions = [],
}) {
  const getLabelForValue = (questionKey, value) => {
    const question = questions.find((q) => q.key === questionKey);
    if (!question) return value;
    const option = question.options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const renderAnswerItem = (key, value) => {
    const question = questions.find((q) => q.key === key);
    if (!question) return null;

    const questionLabel = question.question;
    const isMulti = question.multiSelect;

    return (
      <li key={key}>
        <strong>{questionLabel}</strong>:{" "}
        {isMulti && Array.isArray(value)
          ? value.map((val) => getLabelForValue(key, val)).join(", ")
          : getLabelForValue(key, value)}
      </li>
    );
  };

  const { data: session } = useSession();
  const router = useRouter();

  const [showPremiumModal, setShowPremiumModal] = useState(false);

  /** ✓ FIXED LOGIC  
   Premium → go next  
   Non Premium → show modal  
   Not logged → show modal  
  */
  const handleContinueClick = () => {
    if (session?.user?.isPremium) {
      // Premium user → finish quiz normally
      onNext();
      return;
    }

    // Not premium → show modal
    setShowPremiumModal(true);
  };

  /** When user clicks "Upgrade" inside modal */
  const handleUnlock = () => {
    // If user is logged in but not premium → go premium page
    if (session && !session.user?.isPremium) {
      router.push("/premium");
      return;
    }

    // If user not logged in → also go premium page
    if (!session) {
      router.push("/premium");
      return;
    }
  };

  return (
    <>
      <h2 className={classes.heading}>Review Your Plan Summary</h2>
      <p className={classes.subheading}>Here’s what you’ve shared with us:</p>

      <ul className={classes.summaryList}>
        {Object.entries(answers).map(([key, value]) =>
          renderAnswerItem(key, value)
        )}
      </ul>

      <div className={classes.navigation}>
        <button onClick={onBack} className={classes.button}>
          Back
        </button>

        {/* NOW CORRECT: checks premium before opening modal */}
        <button onClick={handleContinueClick} className={classes.button}>
          Continue →
        </button>
      </div>

      {/* PREMIUM MODAL */}
      {showPremiumModal && (
        <div className={classes.premiumOverlay}>
          <div className={classes.premiumModal}>
            <button
              className={classes.premiumClose}
              onClick={() => setShowPremiumModal(false)}
            >
              ×
            </button>

            <div className={classes.premiumIcon}>🔒</div>

            <h2 className={classes.premiumTitle}>
              Unlock Your Personalized Plan
            </h2>

            <p className={classes.premiumText}>
              Your detailed plan is ready. Please upgrade to Premium to access
              your personalized insights, recommendations, and full plan.
            </p>

            <button
              className={classes.premiumButtonPrimary}
              onClick={handleUnlock}
            >
              Upgrade to Premium →
            </button>

            <button
              className={classes.premiumButtonSecondary}
              onClick={() => setShowPremiumModal(false)}
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
    </>
  );
}
