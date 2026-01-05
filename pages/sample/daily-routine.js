import Head from "next/head";
import Link from "next/link";
import classes from "./daily-routine.module.css";

export default function SampleDailyRoutine() {
  return (
    <>
      <Head>
        <title>Sample Daily Routine | Wellness Pure Life</title>
      </Head>

      <div className={classes.page}>
        <header className={classes.header}>
          <h1 className={classes.title}>Sample Daily Routine</h1>
          <p className={classes.subtitle}>
            An example of how a Premium daily routine can gently structure your day around{" "}
            movement, calm, focus, and recovery — without feeling overwhelming or rigid.
          </p>
        </header>

        <section className={classes.blocks}>
          <article className={classes.block}>
            <h2 className={classes.blockTitle}>Morning Reset</h2>
            <p className={classes.blockTag}>Start calm, not rushed</p>
            <ul className={classes.list}>
              <li>💧 Drink a glass of water before coffee.</li>
              <li>🧘 5 minutes of breathing with longer exhales.</li>
              <li>🚶 5–10 minutes of light movement or stretching.</li>
              <li>📓 Optional: write 1–2 sentences about how you want to feel today.</li>
            </ul>
          </article>

          <article className={classes.block}>
            <h2 className={classes.blockTitle}>Midday Support</h2>
            <p className={classes.blockTag}>Protect energy & focus</p>
            <ul className={classes.list}>
              <li>🥗 Choose a simple, balanced lunch (protein + fibre).</li>
              <li>🚶 5–10 minutes of walking after eating, if possible.</li>
              <li>🧠 1 short “focus block” with notifications off.</li>
              <li>🌬️ 1–2 minutes of slow breathing when you feel tension rising.</li>
            </ul>
          </article>

          <article className={classes.block}>
            <h2 className={classes.blockTitle}>Evening Wind-Down</h2>
            <p className={classes.blockTag}>Help your body feel safe to rest</p>
            <ul className={classes.list}>
              <li>📱 30–60 minutes with reduced screens or blue light.</li>
              <li>🧍 Gentle stretching or slow movement before bed.</li>
              <li>🕯️ Simple “closing ritual”: note 1 thing you’re grateful for.</li>
              <li>🌙 Aim to go to bed at roughly the same time most nights.</li>
            </ul>
          </article>
        </section>

        <section className={classes.bottomCta}>
          <h2>Imagine this, but personalized to your life.</h2>
          <p>
            Premium members receive daily routines adapted to their sleep, stress level, schedule,
            and current capacity — not generic advice.
          </p>
          <div className={classes.buttons}>
            <Link href="/premium" className={classes.primary}>
              Unlock Premium Daily Routines
            </Link>
            <Link href="/quizzes/quiz-main" className={classes.secondary}>
              Take the Free Quiz
            </Link>
          </div>
        </section>

        <Link href="/quizzes/quiz-main" className={classes.floatingQuiz}>
          Try the Free Quiz →
        </Link>
      </div>
    </>
  );
}
