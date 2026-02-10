
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { gaEvent } from "../../lib/gtag";
import classes from "./HomeBlogCTA.module.css";

export default function HomeBlogCTA() {
  // Fire view event on load
  useEffect(() => {
    gaEvent("home_blogcta_view");
    gaEvent("key_home_blogcta_view");
  }, []);

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
          <Link
            href="/blog"
            className={classes.primaryButton}
            onClick={() => {
              gaEvent("home_blogcta_click");
              gaEvent("key_home_blogcta_click");
            }}
          >
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
