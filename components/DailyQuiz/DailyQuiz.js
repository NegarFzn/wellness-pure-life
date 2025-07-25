import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import classes from "./DailyQuiz.module.css";

export default function DailyQuiz({ onClose }) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loginPrompted, setLoginPrompted] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const router = useRouter();

  const handleSubmit = async () => {
    if (!answer) return;

    if (isLoggedIn) {
      await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizSlug: "daily-checkin",
          result: answer,
          answers: [answer],
        }),
      });
      setSubmitted(true);
      setTimeout(onClose, 2500);
    } else {
      setSubmitted(true);
      setLoginPrompted(true); // used only to close modal if they return logged in
    }
  };

  useEffect(() => {
    if (loginPrompted && isLoggedIn) {
      onClose(); // Close modal after successful login
    }
  }, [isLoggedIn, loginPrompted, onClose]);

  return (
    <div className={classes.overlay}>
      <div className={classes.box}>
        {!submitted ? (
          <>
            <h2 className={classes.h2}>🗓️ How are you feeling today?</h2>
            <select
              className={classes.select}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            >
              <option value="">Select your mood</option>
              <option value="High Stress">😣 High Stress</option>
              <option value="Balanced">🙂 Balanced</option>
              <option value="Low Stress">😌 Low Stress</option>
            </select>
            <button className={classes.submitBtn} onClick={handleSubmit}>
              Submit
            </button>
          </>
        ) : isLoggedIn ? (
          <p className={classes.thankYou}>✅ Thanks for checking in!</p>
        ) : (
          <div>
            <p className={classes.thankYou}>
              🔐 Login to save and view your result.
            </p>
            <button
              className={classes.submitBtn}
              onClick={() => {
                onClose(); // immediately close the modal
                router.push("/login"); // then redirect to login page
              }}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
