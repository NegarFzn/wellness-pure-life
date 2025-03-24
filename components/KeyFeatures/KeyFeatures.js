import React from "react";
import Image from "next/image";
import Link from "next/link";
import classes from "./KeyFeatures.module.css";

export default function KeyFeatures() {
  return (
    <section className={classes.featuresSection}>
      <h2 className={classes.heading}>Why Choose Us?</h2>
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
          <h3>Science-Based Guidance</h3>
          <p>
            All content is reviewed by experts to ensure accuracy and safety for
            your body and mind.
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
          <h3>Holistic Wellness</h3>
          <p>
            We cover everything from workouts and nutrition to mental clarity
            and emotional balance.
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
          <h3>Holistic Wellness</h3>
          <p>
            We cover everything from workouts and nutrition to mental clarity
            and emotional balance.
          </p>
        </Link>
      </div>
    </section>
  );
}
