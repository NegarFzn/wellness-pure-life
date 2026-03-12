import { useEffect, useState } from "react";
import Head from "next/head";
import BlogCard from "../../components/Blog/BlogCard";
import BlogCTA from "../../components/Blog/BlogCTA";
import { gaEvent } from "../../lib/gtag";
import classes from "./index.module.css";

export default function BlogPage({ initialPosts = [] }) {
  const [posts] = useState(initialPosts || []);
  const [loading] = useState(false);

  // ---------------------------
  // PAGE VIEW
  // ---------------------------
  useEffect(() => {
    gaEvent("blog_page_view", {
      page_path: "/blog",
    });

    gaEvent("key_blog_page_view", {
      page_path: "/blog",
      referrer: document.referrer || "direct",
    });
  }, []);

  // ---------------------------
  // SCROLL DEPTH
  // ---------------------------
  useEffect(() => {
    let fired = { 25: false, 50: false, 75: false, 100: false };

    const onScroll = () => {
      const h = document.documentElement;
      const scrolled =
        (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;

      [25, 50, 75, 100].forEach((d) => {
        if (!fired[d] && scrolled >= d) {
          fired[d] = true;

          gaEvent("blog_page_scroll", { depth: d });
          gaEvent("key_blog_page_scroll", { depth: d });
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Wellness Blog | Wellness Pure Life</title>

        <meta
          name="description"
          content="Expert wellness articles to help you calm your nervous system, improve energy, and build high-performance habits."
        />

        <meta property="og:title" content="Wellness Blog | Wellness Pure Life" />
        <meta
          property="og:description"
          content="Science-backed wellness articles for energy, stress reduction, sleep, nutrition, and mental clarity."
        />
      </Head>

      <main className={classes.page}>
        {/* Top Intro */}
        <header className={classes.header}>
          <h1 className={classes.heading}>Wellness Blog</h1>

          <p className={classes.subheading}>
            Practical science-backed insights for body, mind, and energy.
          </p>
        </header>

        {/* Loading */}
        {loading && (
          <div className={classes.statusWrap}>
            <p className={classes.statusText}>Loading articles…</p>
          </div>
        )}

        {/* Empty */}
        {!loading && posts?.length === 0 && (
          <div className={classes.statusWrap}>
            <p className={classes.statusText}>
              No articles published yet.
            </p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && posts?.length > 0 && (
          <section className={classes.gridWrapper}>
            <div className={classes.grid}>
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <BlogCTA />
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://wellnesspurelife.com"
      }/api/blog`
    );

    const data = await res.json();

    return {
      props: {
        initialPosts: Array.isArray(data) ? data : [],
      },
    };
  } catch (error) {
    return {
      props: {
        initialPosts: [],
      },
    };
  }
}