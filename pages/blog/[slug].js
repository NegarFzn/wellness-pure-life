import Head from "next/head";
import { useEffect } from "react";
import Image from "next/image";
import BlogCTA from "../../components/Blog/BlogCTA";
import { gaEvent } from "../../lib/gtag";
import classes from "./BlogPost.module.css";
import { connectToDatabase } from "../../utils/mongodb";

export default function BlogPost({ post }) {
  // -------------------------
  // 1. FIRE ARTICLE VIEW WHEN LOADED
  // -------------------------
  useEffect(() => {
    if (!post) return;

    gaEvent("blog_article_view", {
      title: post.title,
      slug: post.slug,
    });
  }, [post]);

  // -------------------------
  // 2. FIRE ENTRY SOURCE ("referrer")
  // -------------------------
  useEffect(() => {
    if (!post?.slug) return;

    gaEvent("blog_article_entry", {
      slug: post.slug,
      referrer: document.referrer || "direct",
    });

    gaEvent("key_blog_article_entry", {
      slug: post.slug,
      referrer: document.referrer || "direct",
    });
  }, [post?.slug]);

  // -------------------------
  // 3. SCROLL DEPTH TRACKING
  // -------------------------
  useEffect(() => {
    if (!post) return;

    let fired = { 25: false, 50: false, 75: false, 100: false };

    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;

      const marks = [25, 50, 75, 100];
      marks.forEach((m) => {
        if (!fired[m] && scrolled >= m) {
          fired[m] = true;

          gaEvent("blog_scroll", { slug: post.slug, depth: m });
          gaEvent("key_blog_scroll", { slug: post.slug, depth: m });
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [post]);

  // -------------------------
  // 4. IMAGE VIEW
  // -------------------------
  useEffect(() => {
    if (!post?.image) return;

    gaEvent("blog_image_view", {
      slug: post.slug,
      image: post.image,
    });

    gaEvent("key_blog_image_view", {
      slug: post.slug,
      image: post.image,
    });
  }, [post]);

  // -------------------------
  // 5. RECOMMENDED POSTS SECTION VIEW
  // -------------------------
  useEffect(() => {
    if (!post?.recommended || post.recommended.length === 0) return;

    gaEvent("blog_recommended_view", {
      slug: post.slug,
      count: post.recommended.length,
    });

    gaEvent("key_blog_recommended_view", {
      slug: post.slug,
      count: post.recommended.length,
    });
  }, [post]);

  // -------------------------
  // 6. CTA VIEW TRACKING
  // -------------------------
  useEffect(() => {
    if (!post) return;

    gaEvent("blog_cta_view", { slug: post.slug });
    gaEvent("key_blog_cta_view", { slug: post.slug });
  }, [post]);

  if (!post) return <p style={{ textAlign: "center", padding: "4rem" }}>Post not found.</p>;

  const validImage = Boolean(post.image);

  const cleanContent =
    typeof post.content === "string"
      ? post.content.replace(/<[^>]+>/g, "")
      : "";

  const cleanedContent =
    typeof post.content === "string"
      ? post.content.replace(
          /<h2>Recommended Reading[\s\S]*?<\/ul><\/div>/gi,
          "",
        )
      : post.content;

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

        <div
          className={classes.content}
          dangerouslySetInnerHTML={{ __html: cleanedContent }}
        />

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

export async function getServerSideProps({ params }) {
  try {
    const { db } = await connectToDatabase();
    const slug = params?.slug;

    const post = await db.collection("blog_posts").findOne(
      { slug, type: "blog" },
      { projection: { type: 0 } }
    );

    if (!post) return { notFound: true };

    const others = await db
      .collection("blog_posts")
      .find({ type: "blog", slug: { $ne: slug } })
      .sort({ createdAt: -1 })
      .limit(14)
      .project({ slug: 1, title: 1, image: 1, excerpt: 1 })
      .toArray();

    post.recommended = others || [];

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
      },
    };
  } catch {
    return { notFound: true };
  }
}
