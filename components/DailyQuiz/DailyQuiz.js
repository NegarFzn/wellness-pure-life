import { useState } from "react";
import classes from "./DailyQuiz.module.css";

export default function DailyQuiz({ onClose }) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!answer) return;
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
    setTimeout(onClose, 1500);
  };

  return (
    <div className={classes.overlay}>
      <div className={classes.box}>
        {!submitted ? (
          <>
            <h2>🗓️ How are you feeling today?</h2>
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
        ) : (
          <p className={classes.thankYou}>✅ Thanks for checking in!</p>
        )}
      </div>
    </div>
  );
}
