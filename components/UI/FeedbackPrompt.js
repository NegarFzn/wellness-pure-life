import { useState } from "react";
import { useRouter } from "next/router";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import styles from "./FeedbackPrompt.module.css";

export default function FeedbackPrompt() {
  const [submitted, setSubmitted] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");

  const router = useRouter();
  const currentSlug = router.asPath;
  const lang = "en"; // Future: auto-detect or use context

  const handleFeedback = async (isPositive) => {
    if (isPositive) {
      await sendFeedback({ isPositive, pageSlug: currentSlug });
      setSubmitted(true);
    } else {
      setShowCommentBox(true);
    }
  };

  const handleSubmitComment = async () => {
    await sendFeedback({
      isPositive: false,
      comment,
      pageSlug: currentSlug,
    });
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
                onChange={(e) => setComment(e.target.value)}
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
