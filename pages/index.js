import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import classes from "./index.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Healthy Living - Mind & Body Wellness</title>
        <meta
          name="description"
          content="Achieve a balanced and healthier life with fitness, mindfulness, and nourishing food tips."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
      </Head>

      <main className={classes.container}>
        <h1 className={classes.title}>
          Nurturing <span className={classes.highlight}>Mind</span> and{" "}
          <span className={classes.highlight}>Body</span> for a Healthier You
        </h1>

        <div className={classes.grid}>
          {/* Fitness Section */}
          <Link href="/fitness" className={classes.card}>
            <Image
              src="/images/fitness.jpg"
              alt="People exercising"
              width={400}
              height={250}
              className={classes.image}
              priority
            />
            <h2>Fitness Awaits</h2>
            <p>
              Energize your day with a swift workout. Sculpt your body, feel the
              change. Let’s get moving!
            </p>
          </Link>

          {/* Mindfulness Section */}
          <Link href="/mindfulness" className={classes.card}>
            <Image
              src="/images/mindfulness.jpg"
              alt="Person meditating on grass"
              width={400}
              height={250}
              className={classes.image}
            />
            <h2>Click for Mindful Bliss</h2>
            <p>
              Find peace through mindfulness. Boost energy, reduce stress, and
              embrace challenges for an energized life.
            </p>
          </Link>

          {/* Nourish Section */}
          <Link href="/nourish" className={classes.card}>
            <Image
              src="/images/nourish.jpg"
              alt="Healthy food on a table"
              width={400}
              height={250}
              className={classes.image}
            />
            <h2>Nourish Your Journey</h2>
            <p>
              Fuel your life with nourishing food. Embrace vitality, make
              healthier choices, and feel your best.
            </p>
          </Link>
        </div>

        <div className={classes.center}>
          <Link href="/signup" className={classes.button}>
            Sign Up
          </Link>
        </div>
      </main>
    </>
  );
}
