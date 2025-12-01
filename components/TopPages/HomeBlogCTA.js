// components/Home/HomeBlogCTA.js
import Link from "next/link";
import classes from "./HomeBlogCTA.module.css";

export default function HomeBlogCTA() {
  return (
    <section className={classes.section}>
      <div className={classes.inner}>
        <h2 className={classes.title}>Learn the Science Behind Your Plan</h2>
        <p className={classes.text}>
          Explore research-based articles on stress, sleep, movement, and
          nutrition. Use the blog to better understand why your wellness plan
          works – and how to make it fit your real life.
        </p>

        <div className={classes.actions}>
          <Link href="/blog" className={classes.primaryButton}>
            Read the Blog
          </Link>
          <p className={classes.note}>
            New articles are added regularly to support your daily routines.
          </p>
        </div>
      </div>
    </section>
  );
}
