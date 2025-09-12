import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import classes from "./QuizPage.module.css";

// Optional: key normalization map (only if needed across quizzes)
const keyMap = {
  time: "timeOfDay", // Fix mismatch between frontend & DB keys
};

export default function QuizPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [inlineError, setInlineError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔹 Auto-fill email from session
  useEffect(() => {
    getSession().then((session) => {
      if (session?.user?.email) {
        setEmail(session.user.email);
        setIsAuthenticated(true);
      }
    });
  }, []);

  // 🔹 Load quiz by slug
  useEffect(() => {
    if (!slug) return;

    fetch("/api/quiz/quiz-main?mode=questions")
      .then((res) => res.json())
      .then((all) => {
        const matched = all.find((q) => q.slug === slug);
        if (matched) {
          setQuiz(matched);
        } else {
          setError("❌ Quiz not found.");
        }
      })
      .catch(() => setError("Failed to load quiz."));
  }, [slug]);

  // 🔹 Track selection
  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  // 🔹 Email format validator
  const isValidEmail = (email) =>
    !!email?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // 🔹 Normalize keys before submission
  const normalizeAnswers = (rawAnswers) => {
    const normalized = {};
    for (const key in rawAnswers) {
      const normalizedKey = keyMap[key] || key;
      normalized[normalizedKey] = rawAnswers[key];
    }
    return normalized;
  };

  // 🔹 Submit
  const handleSubmit = async () => {
    setInlineError("");
    setError(null);
    setResult(null);

    const trimmedEmail = email?.trim();

    // Validation
    if (!quiz || quiz.questions.some((q) => !answers[q.key])) {
      setInlineError("⚠️ Please answer all questions before submitting.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setInlineError("⚠️ Please enter a valid email address.");
      return;
    }

    const normalizedAnswers = normalizeAnswers(answers);

    try {
      const res = await fetch("/api/quiz/quiz-main", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          answers: normalizedAnswers,
          email: trimmedEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setResult(data.result);
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔹 Error screen
  if (error) {
    return <div className={classes.error}>{error}</div>;
  }

  // 🔹 Loading
  if (!quiz) {
    return <div className={classes.loading}>⏳ Loading quiz...</div>;
  }

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>{quiz.title || slug}</h1>

      {!result ? (
        <>
          {quiz.questions.map((q, index) => (
            <div
              key={q.key}
              className={`${classes.questionBlock} ${
                classes[`fadeDelay${index % 4}`]
              } ${classes.animateOnScroll}`}
            >
              <p className={classes.questionText}>{q.question}</p>
              {q.options.map((opt) => (
                <label key={opt} className={classes.optionLabel}>
                  <input
                    type="radio"
                    name={q.key}
                    value={opt}
                    checked={answers[q.key] === opt}
                    onChange={() => handleChange(q.key, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          ))}

          {!isAuthenticated && (
            <input
              type="email"
              placeholder="Your Email"
              className={classes.emailInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}

          {inlineError && (
            <div className={classes.inlineError}>{inlineError}</div>
          )}

          <button onClick={handleSubmit} className={classes.submitButton}>
            🚀 Submit
          </button>
        </>
      ) : (
        <div className={classes.resultBox}>
          <h2 className={classes.resultTitle}>🎯 Your Personalized Tips</h2>

          <div className={classes.resultContent}>
            {result.matchedTitle ? (
              <>
                <p className={classes.resultDescription}>
                  <strong>{result.matchedTitle}</strong>
                </p>
                <p className={classes.resultDescription}>
                  {result.matchedDescription}
                </p>
                <ul className={classes.resultList}>
                  {result.matchedValues?.map((v, i) => (
                    <li key={i}>✅ {v}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p>No matching recommendation found for your responses.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
