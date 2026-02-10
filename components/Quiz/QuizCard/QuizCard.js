import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { trackQuizStart } from "../../../lib/quizEvents";
import { gaEvent } from "../../../lib/gtag";
import classes from "./QuizCard.module.css";

export default function QuizCard() {
  const slug = "quiz-main";

  // -------------------------------------------------------------
  // A) Impression Events (required for funnel completeness)
  // -------------------------------------------------------------
  useEffect(() => {
    gaEvent("quiz_card_view", { slug, component: "QuizCard" });
    gaEvent("key_quiz_card_view", { slug, component: "QuizCard" });
  }, []);

  const handleStartQuiz = () => {
    // -------------------------------------------------------------
    // B) Anomaly tracking (mirror event)
    // -------------------------------------------------------------
    gaEvent("quiz_card_anomaly_start", {
      slug,
      component: "QuizCard",
      location: "homepage",
    });
    gaEvent("key_quiz_card_anomaly_start", {
      slug,
      component: "QuizCard",
      location: "homepage",
    });

    // -------------------------------------------------------------
    // C) Primary business event
    // -------------------------------------------------------------
    gaEvent("key_quiz_start", {
      slug,
      component: "QuizCard",
      location: "homepage",
    });

    // -------------------------------------------------------------
    // D) Custom quiz detail tracking
    // -------------------------------------------------------------
    trackQuizStart(slug);

    // -------------------------------------------------------------
    // E) Micro-click analytics
    // -------------------------------------------------------------
    gaEvent("quiz_card_start_click", {
      slug,
      label: "Start My Quiz button",
    });
  };

  return (
    <div className={classes.card}>
      <div className={classes.cardContent}>
        <div className={classes.imageWrapper}>
          <Image
            src="/images/quiz-banner.jpg"
            alt="Wellness quiz banner with body, mind, nutrition and lifestyle visuals"
            width={420}
            height={240}
            className={classes.image}
            priority
          />
        </div>

        <div className={classes.textBlock}>
          <span className={classes.badge}>✨ Free Wellness Quiz</span>

          <h3 className={classes.title}>
            Discover Your Personal Wellness Profile
          </h3>

          <p className={classes.description}>
            Answer a few quick questions and unlock insights about your body,
            mind, and nutrition style. Designed to help you feel more balanced,
            energized, and confident.
          </p>
        </div>

        <Link
          href="/quizzes/quiz-main"
          onClick={handleStartQuiz}
          className={classes.button}
        >
          Start My Quiz
        </Link>

        <p className={classes.subNote}>
          ⏱ Takes only 60 seconds • No signup required
        </p>
      </div>
    </div>
  );
}
