import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import BlogCTA from "../../components/Blog/BlogCTA";
import { gaEvent } from "../../lib/gtag";
import classes from "./BlogPost.module.css";

export default function BlogPost() {
  const { query } = useRouter();
  const { slug } = query;
  const [post, setPost] = useState(null);

  // Analytics: Fire when the post is loaded
  useEffect(() => {
    if (!post) return;

    gaEvent("blog_article_view", {
      title: post.title,
      slug: post.slug,
    });
  }, [post]);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/blog?slug=${slug}`)
      .then((res) => res.json())
      .then(setPost)
      .catch(() => setPost(null));
  }, [slug]);

  if (!post) return null;

  const validImage = Boolean(post.image);

  // Remove HTML tags for JSON-LD
  const cleanContent =
    typeof post.content === "string"
      ? post.content.replace(/<[^>]+>/g, "")
      : "";

  // Remove OLD repeated Recommended Reading HTML block
  const cleanedContent =
    typeof post.content === "string"
      ? post.content.replace(
          /<h2>Recommended Reading[\s\S]*?<\/ul><\/div>/gi,
          ""
        )
      : post.content;

  // Build full image URL for SEO
  const fullImageUrl =
    post.image && post.image.startsWith("http")
      ? post.image
      : `https://wellnesspurelife.com${post.image || ""}`;

  const publishedDate =
    post.createdAt || post.updatedAt || new Date().toISOString();
  const modifiedDate =
    post.updatedAt || post.createdAt || new Date().toISOString();

  return (
    <>
      <Head>
        <title>{post.title} | Wellness Pure Life</title>
        <meta name="description" content={post.excerpt} />

        {/* SEO META TAGS */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.image && <meta property="og:image" content={fullImageUrl} />}
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary_large_image" />

        {/* JSON-LD SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://wellnesspurelife.com/#organization",
                  name: "Wellness Pure Life",
                  url: "https://wellnesspurelife.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://wellnesspurelife.com/images/logo.png",
                  },
                },

                {
                  "@type": "WebSite",
                  "@id": "https://wellnesspurelife.com/#website",
                  url: "https://wellnesspurelife.com",
                  name: "Wellness Pure Life",
                  publisher: {
                    "@id": "https://wellnesspurelife.com/#organization",
                  },
                  potentialAction: {
                    "@type": "SearchAction",
                    target:
                      "https://wellnesspurelife.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },

                {
                  "@type": "BreadcrumbList",
                  "@id": `https://wellnesspurelife.com/blog/${post.slug}#breadcrumb`,
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Blog",
                      item: "https://wellnesspurelife.com/blog",
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: post.title,
                      item: `https://wellnesspurelife.com/blog/${post.slug}`,
                    },
                  ],
                },

                {
                  "@type": "BlogPosting",
                  "@id": `https://wellnesspurelife.com/blog/${post.slug}#blogposting`,
                  headline: post.title,
                  description: post.excerpt,
                  articleBody: cleanContent,
                  url: `https://wellnesspurelife.com/blog/${post.slug}`,

                  image: post.image
                    ? {
                        "@type": "ImageObject",
                        url: fullImageUrl,
                        width: 1200,
                        height: 630,
                      }
                    : undefined,

                  author: {
                    "@type": "Organization",
                    "@id": "https://wellnesspurelife.com/#organization",
                    name: "Wellness Pure Life",
                  },

                  publisher: {
                    "@id": "https://wellnesspurelife.com/#organization",
                  },

                  datePublished: publishedDate,
                  dateModified: modifiedDate,
                },
              ],
            }),
          }}
        />
      </Head>

      <article className={classes.page}>
        <h1 className={classes.title}>{post.title}</h1>

        {validImage && (
          <div className={classes.imageWrapper}>
            <Image
              src={post.image}
              alt={post.title}
              fill
              className={classes.cover}
            />
          </div>
        )}

        <p className={classes.excerpt}>{post.excerpt}</p>

        {/* Render cleaned content WITHOUT old Recommended Reading list */}
        <div
          className={classes.content}
          dangerouslySetInnerHTML={{ __html: cleanedContent }}
        />

        {/* ⭐ Premium Recommended Reading */}
        {post.recommended && post.recommended.length > 0 && (
          <div className={classes.recommendedSection}>
            <h2 className={classes.recommendedTitle}>Recommended Reading</h2>

            <div className={classes.recommendedScroller}>
              {post.recommended.map((item, index) => (
                <a
                  key={index}
                  href={`/blog/${item.slug}`}
                  className={classes.recoCard}
                  onClick={() =>
                    gaEvent("blog_recommended_click", {
                      sourcePost: post.slug,
                      targetPost: item.slug,
                    })
                  }
                >
                  <div className={classes.recoImageWrap}>
                    <Image
                      src={item.image || "/images/blog-placeholder.jpg"}
                      alt={item.title}
                      width={140}
                      height={90}
                      className={classes.recoImage}
                    />
                  </div>

                  <div className={classes.recoInfo}>
                    <h3 className={classes.recoTitle}>{item.title}</h3>
                    <span className={classes.recoCTA}>Read now →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        <BlogCTA />
      </article>
    </>
  );
}
