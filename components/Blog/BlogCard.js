import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { gaEvent } from "../../lib/gtag";
import classes from "./BlogCard.module.css";

export default function BlogCard({ post }) {
  const imageSrc =
    post.image && post.image.trim() !== ""
      ? post.image
      : "/images/blog/default.jpg";

  // 🔥 GA4: Impression event (fires when card loads)
  useEffect(() => {
    gaEvent("blog_article_impression", {
      title: post.title,
      slug: post.slug,
    });

    // 🔥 Required for GA4 anomaly detection
    gaEvent("key_blog_article_impression", {
      title: post.title,
      slug: post.slug,
    });
  }, []);

  return (
    <article className={classes.card}>
      <div className={classes.imageWrap}>
        <Image
          src={imageSrc}
          alt={post.title}
          width={600}
          height={340}
          className={classes.image}
        />
      </div>

      <div className={classes.content}>
        <h3 className={classes.title}>{post.title}</h3>

        {post.excerpt && <p className={classes.excerpt}>{post.excerpt}</p>}

        <Link
          href={`/blog/${post.slug}`}
          className={classes.readBtn}
          onClick={() => {
            // 🔥 Normal event
            gaEvent("blog_article_card_click", {
              title: post.title,
              slug: post.slug,
            });

            // 🔥 Anomaly detection event
            gaEvent("key_blog_article_card_click", {
              title: post.title,
              slug: post.slug,
            });
          }}
        >
          Read Article →
        </Link>
      </div>
    </article>
  );
}
