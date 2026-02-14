import Link from "next/link";
import classes from "./index.module.css";
import { gaEvent } from "../../lib/gtag";

export default function ChallengesPage() {
  return (
    <div className={classes.wrapper}>
      <h1 className={classes.title}>21-Day Wellness Challenges</h1>
      <p className={classes.subtitle}>
        Build strength, find calm, and nourish your body — one day at a time.
      </p>

      <div className={classes.grid}>
        
        {/* FITNESS */}
        <div className={classes.card}>
          <h2>Get Strong in 21 Days</h2>
          <p>
            Build lean muscle and boost your daily energy with short, 
            effective workouts you can easily follow.
          </p>
          <Link
            href="/challenges/21-days-fitness/1"
            className={classes.cardBtn}
            onClick={() =>
              gaEvent("challenge_start_click", { challenge: "fitness" })
            }
          >
            Start Fitness Challenge →
          </Link>
        </div>

        {/* MINDFULNESS */}
        <div className={classes.card}>
          <h2>Find Calm in 21 Days</h2>
          <p>
            Reduce stress, improve focus, and build emotional balance 
            through daily mindfulness practices.
          </p>
          <Link
            href="/challenges/21-days-mindfulness/1"
            className={classes.cardBtn}
            onClick={() =>
              gaEvent("challenge_start_click", { challenge: "mindfulness" })
            }
          >
            Start Mindfulness Challenge →
          </Link>
        </div>

        {/* NOURISH */}
        <div className={classes.card}>
          <h2>Eat Clean in 21 Days</h2>
          <p>
            Reset your eating habits, improve digestion, and boost your 
            natural energy with simple nourishing steps.
          </p>
          <Link
            href="/challenges/21-days-nourish/1"
            className={classes.cardBtn}
            onClick={() =>
              gaEvent("challenge_start_click", { challenge: "nourish" })
            }
          >
            Start Nourish Challenge →
          </Link>
        </div>

      </div>
    </div>
  );
}
