import React from "react";
import Image from "next/image";
import Link from "next/link";
import classes from "./KeyFeatures.module.css";

export default function KeyFeatures() {
  return (
    <section className={classes.featuresSection}>
      <h2 className={classes.heading}>Guiding You to a Healthier Life</h2>
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
          <h3>Stronger Body</h3>
          <p>
            💪 Discover guided workouts and expert tips to help you move better,
            build lasting strength, and feel your best.
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
          <h3>Calm Your Mind</h3>
          <p>
            🧘‍♀️ Learn to reduce stress, improve focus, and create calm through
            simple mindfulness practices and breathing.
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
          <h3>Nourishment</h3>
          <p>
            🌿 Fuel up with balanced meals and superfoods that energize, heal,
            and uplift—naturally.
          </p>
        </Link>
      </div>
    </section>
  );
}
