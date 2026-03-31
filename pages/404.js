import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { gaEvent } from "../lib/gtag";
import classes from "./404.module.css";

export default function Custom404() {
  useEffect(() => {
    gaEvent("page_not_found", {
      path: typeof window !== "undefined" ? window.location.pathname : "",
    });
  }, []);

  return (
    <>
      <Head>
        <title>Page Not Found | Wellness Pure Life</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={classes.wrapper}>
        <div className={classes.card}>
          <span className={classes.icon}>🌿</span>
          <h1 className={classes.heading}>Page Not Found</h1>
          <p className={classes.text}>
            This page seems to have wandered off. Let&apos;s get you back on
            track.
          </p>
          <div className={classes.links}>
            <Link href="/" className={classes.primaryBtn}>
              Go to Home
            </Link>
            <Link href="/fitness" className={classes.secondaryBtn}>
              Explore Fitness
            </Link>
            <Link href="/news" className={classes.secondaryBtn}>
              Read News
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}