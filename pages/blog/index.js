import { useEffect, useState } from "react";
import Head from "next/head";
import BlogCard from "../../components/Blog/BlogCard";
import BlogCTA from "../../components/Blog/BlogCTA";
import { gaEvent } from "../../lib/gtag";
import classes from "./index.module.css";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  gaEvent("blog_page_view", {
    page_path: "/blog",
  });
}, []);



  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Wellness Blog | Wellness Pure Life</title>
        <meta
          name="description"
          content="Expert wellness articles to help you calm your nervous system, improve energy, and build high-performance habits."
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

        {/* Loading State */}
        {loading && (
          <div className={classes.statusWrap}>
            <p className={classes.statusText}>Loading articles…</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className={classes.statusWrap}>
            <p className={classes.statusText}>No articles published yet.</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && posts.length > 0 && (
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
