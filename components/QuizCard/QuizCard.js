import Link from "next/link";
import Image from "next/image";
import classes from "./QuizCard.module.css";

export default function QuizCard() {
  return (
    <div className={classes.card}>
      <div className={classes.cardContent}>
        <Image
          src="/images/quiz-banner.jpg"
           alt="Wellness quiz banner with body, mind, and nutrition visuals"
          width={320}
          height={180}
          className={classes.image}
        />
        <h3 className={classes.title}>🧠 Discover Your Wellness Type</h3>
        <p className={classes.description}>
          Take our personalized quiz to get insights into your body, mind, and
          nutrition. Start your path to balance.
        </p>
        <Link href="/quizzes/quiz-main" className={classes.button}>
          Take the Quiz
        </Link>
      </div>
    </div>
  );
}
