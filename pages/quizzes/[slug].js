import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { getQuizBySlug } from "../../lib/quizzesdb";
import classes from "./QuizPage.module.css";

export async function getServerSideProps(context) {
  const quiz = await getQuizBySlug(context.params.slug);
  if (!quiz) {
    return { notFound: true };
  }
  return { props: { quiz: JSON.parse(JSON.stringify(quiz)) } };
}

export default function QuizPage({ quiz }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      if (session?.user?.email) {
        setEmail(session.user.email);
        setIsAuthenticated(true);
      }
    }
    checkSession();
  }, []);

  const handleAnswer = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    const answerValues = Object.values(answers);
    const traitScores = {};

    for (const answer of answerValues) {
      const traits = answer.points;
      for (const [trait, pts] of Object.entries(traits)) {
        traitScores[trait] = (traitScores[trait] || 0) + pts;
      }
    }

    let calculatedResult = null;
    let maxScore = -1;

    for (const [trait, score] of Object.entries(traitScores)) {
      if (score > maxScore) {
        maxScore = score;
        calculatedResult = trait;
      }
    }

    setResult(calculatedResult);
    setIsLoadingRecs(true);

    try {
      await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizSlug: quiz.slug,
          result: calculatedResult,
          answers,
          email,
        }),
      });

      const recRes = await fetch(
        `/api/quizzes?type=${encodeURIComponent(
          calculatedResult
        )}&quizSlug=${encodeURIComponent(quiz.slug)}`
      );

      const recs = await recRes.json();
      setRecommendations(recs);
    } catch (error) {
      console.error(
        "Error submitting quiz or fetching recommendations:",
        error
      );
    } finally {
      setIsLoadingRecs(false);
    }
  };

  const handleRecommendationClick = async (rec) => {
    try {
      await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "click",
          quizSlug: quiz.slug,
          result,
          email,
          recommendation: rec.title,
          link: rec.link,
          clickedAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Failed to log click:", err);
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>{quiz.title}</h1>
      {!result ? (
        <div>
          {quiz.questions.map((q) => (
            <div key={q.id} className={classes.questionBlock}>
              <p className={classes.questionText}>{q.question}</p>
              {q.options.map((opt) => (
                <label key={opt.text} className={classes.optionLabel}>
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.text}
                    onChange={() => handleAnswer(q.id, opt)}
                    className="mr-2"
                  />
                  {opt.text}
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
              required
            />
          )}
          <button onClick={handleSubmit} className={classes.submitButton}>
            Submit
          </button>
        </div>
      ) : (
        <div className={classes.recommendationList}>
          <h2 className={classes.recommendationTitle}>Your Result: {result}</h2>
          <h3 className={classes.recommendationTitle}>Recommendations</h3>
          {isLoadingRecs ? (
            <p className={classes.recommendationDesc}>
              🧠 Just a moment… we're curating your personalized wellness tips!
            </p>
          ) : recommendations.length > 0 ? (
            <ul>
              {recommendations.map((rec) => (
                <li
                  key={rec._id}
                  className={classes.recommendationItem}
                  onClick={() => handleRecommendationClick(rec)}
                >
                  <p className="font-semibold">{rec.title}</p>
                  <p className={classes.recommendationDesc}>
                    {rec.description}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={classes.recommendationDesc}>
              No recommendations found for this result.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
