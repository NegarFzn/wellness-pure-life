import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { gaEvent } from "../../lib/gtag";
import styles from "./FeedbackPrompt.module.css";

export default function FeedbackPrompt() {
  const [submitted, setSubmitted] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");

  const router = useRouter();
  const currentSlug = router.asPath;
  const lang = "en";

  // ---- VIEW EVENT ----
  useEffect(() => {
    gaEvent("feedback_view", { pageSlug: currentSlug });
    gaEvent("key_feedback_view", { pageSlug: currentSlug });
  }, [currentSlug]);

  const handleFeedback = async (isPositive) => {
    if (isPositive) {
      gaEvent("feedback_positive_click", { pageSlug: currentSlug });
      gaEvent("key_feedback_positive_click", { pageSlug: currentSlug });

      await sendFeedback({ isPositive, pageSlug: currentSlug });

      gaEvent("feedback_positive_saved", { pageSlug: currentSlug });
      gaEvent("key_feedback_positive_saved", { pageSlug: currentSlug });

      setSubmitted(true);
    } else {
      gaEvent("feedback_negative_click", { pageSlug: currentSlug });
      gaEvent("key_feedback_negative_click", { pageSlug: currentSlug });

      setShowCommentBox(true);
    }
  };

  const handleSubmitComment = async () => {
    gaEvent("feedback_negative_submit", {
      pageSlug: currentSlug,
      comment_length: comment.length,
    });
    gaEvent("key_feedback_negative_submit", {
      pageSlug: currentSlug,
      comment_length: comment.length,
    });

    await sendFeedback({
      isPositive: false,
      comment,
      pageSlug: currentSlug,
    });

    gaEvent("feedback_complete", { pageSlug: currentSlug });
    gaEvent("key_feedback_complete", { pageSlug: currentSlug });

    setSubmitted(true);
  };

  const sendFeedback = async ({ isPositive, comment = "", pageSlug }) => {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageSlug,
          isPositive,
          comment,
          lang,
        }),
      });
    } catch (err) {
      console.error("❌ Feedback API error:", err);

      gaEvent("feedback_api_error", {
        pageSlug,
        message: err?.message,
      });
      gaEvent("key_feedback_api_error", {
        pageSlug,
        message: err?.message,
      });
    }
  };

  return (
    <div className={styles.feedbackBox}>
      {!submitted ? (
        <>
          {!showCommentBox ? (
            <>
              <span>Is this page useful?</span>

              <div className={styles.icons}>
                <FaThumbsUp
                  className={`${styles.icon} ${styles.green}`}
                  onClick={() => handleFeedback(true)}
                />
                <FaThumbsDown
                  className={`${styles.icon} ${styles.red}`}
                  onClick={() => handleFeedback(false)}
                />
              </div>
            </>
          ) : (
            <div className={styles.commentWrapper}>
              <p className={styles.question}>
                Would you like to tell us what went wrong?
              </p>

              <textarea
                className={styles.textarea}
                placeholder="Your feedback (optional)"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);

                  gaEvent("feedback_comment_type", {
                    pageSlug: currentSlug,
                    length: e.target.value.length,
                  });
                  gaEvent("key_feedback_comment_type", {
                    pageSlug: currentSlug,
                    length: e.target.value.length,
                  });
                }}
              />

              <button
                className={styles.submitButton}
                onClick={handleSubmitComment}
              >
                Submit
              </button>
            </div>
          )}
        </>
      ) : (
        <span>🙏 We appreciate your feedback — it helps us grow stronger.</span>
      )}
    </div>
  );
}
