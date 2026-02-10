import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import MultiStartQuiz from "../../../components/Quiz/QuizPlan/1_StartQuiz";
import { gaEvent } from "../../../lib/gtag";

import classes from "./QuizPage.module.css";
import Subscribe from "../../../components/Subscribe/subscribe";

const keyMap = {
  time: "timeOfDay",
};

export default function QuizPage() {
  const router = useRouter();
  const { slug } = router.query;

  const { data: session } = useSession();
  const user = session?.user;

  const [quiz, setQuiz] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [inlineError, setInlineError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const planTypes = [
    { type: "fitness", label: "💪 Fitness Plan" },
    { type: "mindfulness", label: "🧘 Mindfulness Plan" },
    { type: "nourish", label: "🥗 Nourish Plan" },
  ];

  useEffect(() => {
    if (!result) return;

    gaEvent("quiz_recommendation_list_view", {
      slug,
      count: result?.matchedValues?.length || 0,
    });
    gaEvent("key_quiz_recommendation_list_view", {
      slug,
      count: result?.matchedValues?.length || 0,
    });
  }, [result, slug]);

  const handleQuizOpen = (type) => {
    gaEvent("plan_quiz_modal_open", { slug, plan_type: type });
    gaEvent("key_plan_quiz_modal_open", { slug, plan_type: type });

    setActiveQuiz(type);
  };

  const closeQuizModal = () => {
    gaEvent("plan_quiz_modal_close", { slug });
    gaEvent("key_plan_quiz_modal_close", { slug });

    setActiveQuiz(null);
  };

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [session]);

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

  useEffect(() => {
    if (!quiz || !slug) return;

    gaEvent("quiz_main_loaded", {
      slug,
      number_of_questions: quiz?.questions?.length || 0,
    });
    gaEvent("key_quiz_main_loaded", {
      slug,
      number_of_questions: quiz?.questions?.length || 0,
    });
  }, [quiz, slug]);

  const handleChange = (key, value) => {
    gaEvent("quiz_question_answered", {
      slug,
      question_key: key,
      answer_value: value,
    });
    gaEvent("key_quiz_question_answered", {
      slug,
      question_key: key,
      answer_value: value,
    });

    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const isValidEmail = (email) =>
    !!email?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const normalizeAnswers = (rawAnswers) => {
    const normalized = {};
    for (const key in rawAnswers) {
      const normalizedKey = keyMap[key] || key;
      normalized[normalizedKey] = rawAnswers[key];
    }
    return normalized;
  };

  const handleSubmit = async () => {
    setInlineError("");
    setError(null);
    setResult(null);

    gaEvent("quiz_submit_clicked", { slug });
    gaEvent("key_quiz_submit_clicked", { slug });

    const trimmedEmail = email?.trim();

    if (!quiz || quiz.questions.some((q) => !answers[q.key])) {
      setInlineError("⚠️ Please answer all questions before submitting.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setInlineError("⚠️ Please enter a valid email address.");
      return;
    }

    const normalizedAnswers = normalizeAnswers(answers);

    const login = await signIn("credentials", {
      redirect: false,
      email: trimmedEmail,
    });

    if (!login?.error) {
      setIsAuthenticated(true);
    }

    try {
      const res = await fetch("/api/quiz/quiz-main", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          answers: JSON.stringify(normalizedAnswers),
          email: trimmedEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");

      if (data.result) {
        setResult(data.result);

        gaEvent("quiz_completed", {
          slug,
          answers: normalizedAnswers,
          email: trimmedEmail,
        });
        gaEvent("key_quiz_completed", {
          slug,
          answers: normalizedAnswers,
          email: trimmedEmail,
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className={classes.error}>{error}</div>;
  }

  if (!quiz) {
    return <div className={classes.loading}>⏳ Loading quiz...</div>;
  }

  async function handleSendEmail() {
    setIsSending(true);
    setIsSent(false);

    const finalEmail = user?.email || email?.trim() || result?.email;

    if (!finalEmail) {
      alert("Email is missing. Please login or enter your email.");
      setIsSending(false);
      return;
    }

    try {
      const res = await fetch("/api/quiz/quiz-main?mode=send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: finalEmail,
          slug,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        gaEvent("quiz_email_sent", { slug, email: finalEmail });
        gaEvent("key_quiz_email_sent", { slug, email: finalEmail });

        setIsSending(false);
        setIsSent(true);
        setTimeout(() => setIsSent(false), 3000);
      } else {
        setIsSending(false);
        alert(data.error || "Email sending failed.");
      }
    } catch (err) {
      setIsSending(false);
      alert("Network error. Please try again.");
    }
  }

  useEffect(() => {
    if (!slug || !quiz) return;

    gaEvent("quiz_page_loaded", { slug });
    gaEvent("key_quiz_page_loaded", { slug });
  }, [quiz, slug]);

  useEffect(() => {
    if (!result) return;

    gaEvent("quiz_recommendation_viewed", {
      slug,
      title: result?.matchedTitle || "no_match",
    });
    gaEvent("key_quiz_recommendation_viewed", {
      slug,
      title: result?.matchedTitle || "no_match",
    });
  }, [result]);

  return (
    <>
      <Head>
        <title>
          {quiz?.title
            ? `${quiz.title} – Wellness Pure Life Quiz`
            : "Wellness Quiz – Wellness Pure Life"}
        </title>
        <meta
          name="description"
          content={
            quiz?.description ||
            "Discover personalized wellness tips with our interactive quiz."
          }
        />
      </Head>

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
                onFocus={() => {
                  gaEvent("quiz_email_input_focus", { slug });
                  gaEvent("key_quiz_email_input_focus", { slug });
                }}
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

            <button
              className={`${classes.sendEmailButton} ${
                isSent ? classes.sent : ""
              } ${isSending ? classes.sending : ""}`}
              onClick={handleSendEmail}
              disabled={isSending || isSent}
            >
              <span className={classes.emailIconWrap}>
                {!isSending && !isSent && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <polyline points="3,5 12,13 21,5" />
                  </svg>
                )}

                {isSending && <span className={classes.spinner}></span>}

                {isSent && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="4 12 10 17 20 6" />
                  </svg>
                )}
              </span>

              <span className={classes.emailButtonText}>
                {!isSending && !isSent && "Send My Results to Email"}
                {isSending && <span className={classes.spinner}></span>}
                {isSent && "Sent Successfully"}
              </span>
            </button>
          </div>
        )}

        <div className={classes.blogCtaWrap}>
          <a
            href="/blog"
            className={classes.blogCta}
            onClick={() => {
              gaEvent("blog_support_click", { from: "quiz-page" });
              gaEvent("key_blog_support_click", { from: "quiz-page" });
            }}
          >
            Explore More Wellness Guides →
          </a>
        </div>

        {result && <Subscribe />}

        <div className={classes.softPremiumBox}>
          <h4 className={classes.softPremiumTitle}>
            ✨ Turn your results into a structured plan
          </h4>

          <div className={classes.noPlan}>
            <div className={classes.planLinksGrid}>
              {planTypes.map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => handleQuizOpen(type)}
                  className={classes.takePlanLink}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {activeQuiz && (
            <div
              className={classes.modalOverlay}
              onClick={() => closeQuizModal()}
            >
              <div
                className={classes.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={classes.closeModal}
                  onClick={() => closeQuizModal()}
                >
                  ❌
                </button>
                <MultiStartQuiz slug={`${activeQuiz}-plan`} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
