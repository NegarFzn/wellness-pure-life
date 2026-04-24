import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import classes from "./Step.module.css";
import { gaEvent } from "../../../lib/gtag";

export default function MultiSummaryStep({
  onBack,
  onNext,
  answers,
  slug,
  questions = [],
}) {
  // ===============================
  // Fire event when Summary loads
  // ===============================
  useEffect(() => {
    gaEvent("quiz_summary_view", { slug });
    gaEvent("key_quiz_summary_view", { slug });
  }, [slug]);

  useEffect(() => {
    if (!answers) return;

    gaEvent("quiz_summary_answers_loaded", {
      slug,
      totalAnswers: Object.keys(answers).length,
    });

    gaEvent("key_quiz_summary_answers_loaded", {
      slug,
      totalAnswers: Object.keys(answers).length,
    });
  }, [answers, slug]);

  const getLabelForValue = (questionKey, value) => {
    const question = questions.find((q) => q.key === questionKey);
    if (!question) return value;
    const option = question.options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  // Fire view event for each answer item when answers load
  useEffect(() => {
    if (!answers) return;
    Object.keys(answers).forEach((key) => {
      gaEvent("quiz_summary_item_view", { slug, item: key });
      gaEvent("key_quiz_summary_item_view", { slug, item: key });
    });
  }, [answers, slug]);

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

  // ===============================
  // When user clicks Continue
  // ===============================
  const handleContinueClick = () => {
    gaEvent("quiz_summary_continue", { slug });
    gaEvent("key_quiz_summary_continue", { slug });

    gaEvent("key_quiz_summary_completed", {
      slug,
      totalAnswers: Object.keys(answers || {}).length,
    });

    if (session?.user?.isPremium) {
      onNext();
      return;
    }

    setShowPremiumModal(true);

    gaEvent("quiz_premium_gate_view", { slug });
    gaEvent("key_quiz_premium_gate_view", { slug });

    gaEvent("quiz_premium_modal_open", { slug });
    gaEvent("key_quiz_premium_modal_open", { slug });
  };

  // ===============================
  // User clicks Upgrade
  // ===============================
  const handleUnlock = () => {
    gaEvent("quiz_premium_upgrade_click", { slug });
    gaEvent("key_quiz_premium_upgrade_click", { slug });

    if (!session || !session.user?.isPremium) {
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
          renderAnswerItem(key, value),
        )}
      </ul>

      <div className={classes.navigation}>
        <button
          onClick={() => {
            gaEvent("quiz_summary_back_click", { slug });
            gaEvent("key_quiz_summary_back_click", { slug });
            onBack();
          }}
          className={classes.button}
        >
          Back
        </button>

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
              onClick={() => {
                setShowPremiumModal(false);
                gaEvent("quiz_premium_close", { slug });
                gaEvent("key_quiz_premium_close", { slug });

                gaEvent("quiz_premium_later_click", { slug });
                gaEvent("key_quiz_premium_later_click", { slug });
              }}
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
              onClick={() => {
                setShowPremiumModal(false);
                gaEvent("quiz_premium_later_click", { slug });
                gaEvent("key_quiz_premium_later_click", { slug });
                gaEvent("quiz_free_preview_click", { slug });
                gaEvent("key_quiz_free_preview_click", { slug });
                onNext();
              }}
            >
              Continue with free preview →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
