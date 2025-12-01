import Link from "next/link";
import classes from "./BlogCTA.module.css";

export default function BlogCTA() {
  return (
    <section className={classes.cta}>
      <div className={classes.inner}>
        <h2 className={classes.title}>
          Create Your Personalized Wellness System
        </h2>

        <p className={classes.text}>
          Start with our free wellness quiz and discover what your body and mind
          truly need. Explore at your own pace — no pressure.
        </p>

        <Link href="/quizzes/quiz-main" className={classes.button}>
          Take Free Quiz
        </Link>
      </div>
    </section>
  );
}
