import React from "react";
import Image from "next/image";
import Link from "next/link";
import classes from "./KeyFeatures.module.css";

export default function KeyFeatures() {
  return (
    <section className={classes.featuresSection}>
      <h2 className={classes.heading}>Guiding You to a Healthier Lifes</h2>
      <div className={classes.featureGrid}>
        <Link href="/fitness" className={classes.featureCard}>
          <Image
            src="/images/fitness.jpg"
            alt="People exercising"
            width={200}
            height={150}
            className={classes.icon}
            priority
          />
          <h3>💪 Strong Body, Stronger You</h3>
          <p>
            From guided workouts to expert-backed fitness tips, we help you
            build strength, boost energy, and feel unstoppable—one rep at a
            time.
          </p>
        </Link>
        <Link href="/mindfulness" className={classes.featureCard}>
          <Image
            src="/images/mindfulness.jpg"
            alt="Person meditating on grass"
            width={200}
            height={150}
            className={classes.icon}
            priority
          />
          <h3>🧘‍♀️ Calm Your Mind</h3>
          <p>
            Breathe in clarity, breathe out stress. Discover simple, proven
            techniques to quiet your mind and stay grounded—even when life gets
            overwhelming.
          </p>
        </Link>
        <Link href="/nourish" className={classes.featureCard}>
          <Image
            src="/images/nourish.jpg"
            alt="Healthy food on a table"
            width={200}
            height={150}
            className={classes.icon}
            priority
          />
          <h3>🌿 Fuel Your Life with Nourishment</h3>
          <p>
            Fuel up with balanced meals and superfoods that energize, heal, and
            uplift—naturally.
          </p>
        </Link>
      </div>
    </section>
  );
}
