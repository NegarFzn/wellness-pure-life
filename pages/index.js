import Link from "next/link";
import Head from "next/head";
import BodySlideshow from "../components/images/body-slideshow";
import MindSlideshow from "../components/images/mind-slideshow";
import FoodSlideshow from "../components/images/food-slideshow";
import classes from "./index.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Healthy Life</title>
        <meta
          name="description"
          content="A healthy lifestyle is a balanced blend of good nutrition, regular exercise, and stress management, aimed at sustaining both body and mind."
        />
      </Head>
      <div className={classes.title}>
        <h1>Nurturing Mind and Body for a Healthier You</h1>
      </div>
      <header className={classes.header}>
        <div className={classes.slideshow}>
          <BodySlideshow />
          <Link href="/fitness">
            <h3>Fitness Awaits</h3>
            <p className={classes.description}>
              Energize your day with a swift workout! Unleash vitality, sculpt
              your body, and feel the difference. Ready to move? Let&apos;s go!
            </p>
          </Link>
        </div>
        <div className={classes.slideshow}>
          <MindSlideshow />
          <Link href="/mindfulness">
            <h3>Click for Mindful Bliss</h3>
            <p className={classes.description}>
              Energize your day with mindfulness! Boost energy, reduce stress,
              and conquer challenges. Dive in for an energized life.
            </p>
          </Link>
        </div>
        <div className={classes.slideshow}>
          <FoodSlideshow />
          <Link href="/nutrition">
            <h3>Nourish Your Journey</h3>
            <p className={classes.description}>
              Fuel your life with wholesome nutrition. Embrace vitality, make
              healthier choices, and live your best.
            </p>
          </Link>
        </div>
      </header>
      <div className={classes.subscribe}>
        <Link href="">Sign Up</Link>
      </div>
      <main></main>
    </>
  );
}
