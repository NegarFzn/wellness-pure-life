import Link from "next/link";
import Image from "next/image";
import classes from "./QuizCard.module.css";

export default function QuizCard() {
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

        <Link href="/quizzes/quiz-main" className={classes.button}>
          Start My Quiz
        </Link>

        <p className={classes.subNote}>
          ⏱ Takes only 60 seconds • No signup required
        </p>
      </div>
    </div>
  );
}
