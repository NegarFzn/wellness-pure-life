import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { fetchNews } from "../utils/fetch";
import Head from "next/head";
import Link from "next/link";
import { gaEvent } from "../lib/gtag";
import Subscribe from "../components/Subscribe/subscribe";
import KeyFeatures from "../components/KeyFeatures/KeyFeatures";
import DailyList from "../components/DailyList/DailyList";
import ResetPassword from "../components/Auth/ResetPassword";
import ResendVerificationModal from "../components/Auth/ResendVerificationModal";
import QuizCard from "../components/Quiz/QuizCard/QuizCard";
import HomeBlogCTA from "../components/TopPages/HomeBlogCTA";
import WeeklyPlanCard from "../components/Plan/WeeklyPlanCard";
import DailyRoutineCard from "../components/Plan/DailyRoutineCard";
import classes from "./index.module.css";

export default function Home() {
  const newsGridRef = useRef(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendResult, setResendResult] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const router = useRouter();
  const { token, email, resetToken } = router.query;
  const { data: session, status } = useSession();
  const user = session?.user;
  const loading = status === "loading";

  useEffect(() => {
    gaEvent("home_page_view");
    gaEvent("key_home_page_view");
  }, []);

  useEffect(() => {
    const getNews = async () => {
      const news = await fetchNews();
      setNewsArticles(news.slice(0, 4));
    };
    getNews();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (token && email) {
      const verifyEmail = async () => {
        setVerifying(true);
        try {
          const res = await fetch(
            `/api/auth/emailverification?token=${token}&email=${email}`,
          );
          const data = await res.json();

          if (res.ok && data.success) {
            router.replace("/login?verified=true");
          } else {
            setVerifyStatus(data.message || "Verification failed");
          }
        } catch (err) {
          console.error("Verification error:", err);
          setVerifyStatus("Unexpected error during verification.");
        } finally {
          setVerifying(false);
        }
      };

      verifyEmail();
    }
  }, [token, email]);

  useEffect(() => {
    if (resetToken) {
      setShowResetModal(true);
    }
  }, [resetToken]);

  useEffect(() => {
    const container = newsGridRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(`.${classes.newsCard}`);
    const isHorizontalScroll = window.innerWidth < 1024;
    if (!cards.length || !isHorizontalScroll) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = [...cards].indexOf(entry.target);
            const item = newsArticles[index];

            // Update slider dot
            setActiveIndex(index);

            // 🔥 Analytics IMPRESSION event
            if (item) {
              gaEvent("home_news_card_view", {
                slug: item.slug,
                index,
              });

              gaEvent("key_home_news_card_view", {
                slug: item.slug,
                index,
              });
            }
          }
        });
      },
      { threshold: 0.6, root: container },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [newsArticles]);

  const scrollNews = (direction) => {
    const container = newsGridRef.current;
    if (!container) return;
    const isHorizontalScroll = window.innerWidth < 1024;
    if (!isHorizontalScroll) return;
    const card = container.querySelector(`.${classes.newsCard}`);
    const scrollAmount = card?.offsetWidth + 16 || 300;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleResend = async (e) => {
    e.preventDefault();
    setResendResult(null);
    try {
      const res = await fetch("/api/auth/emailverification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();
      setResendResult(
        res.ok
          ? "✅ A new verification link has been sent."
          : `❌ ${data.message}`,
      );
    } catch (err) {
      console.error("❌ Resend error:", err);
      setResendResult("❌ Failed to resend verification. Try again.");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Head>
        <title>Wellness Pure Life – Fitness, Nutrition & Mindfulness</title>
        <meta
          name="description"
          content="Wellness Pure Life helps you thrive with expert tips in fitness, mindfulness, and nutrition. Discover guides, workouts, recipes, and wellness insights."
        />
        <meta
          name="keywords"
          content="fitness, mindfulness, nutrition, wellness, healthy living, workouts, mental health"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />

        {/* Open Graph (Facebook/LinkedIn) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wellness Pure Life" />
        <meta
          property="og:title"
          content="Wellness Pure Life – Fitness, Nutrition & Mindfulness"
        />
        <meta
          property="og:description"
          content="Thrive with Wellness Pure Life: your trusted source for fitness routines, mindful practices, and nutritious living."
        />
        <meta
          property="og:image"
          content="https://wellnesspurelife.com/images/social-card.jpg"
        />
        <meta property="og:url" content="https://wellnesspurelife.com/" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Wellness Pure Life – Fitness, Nutrition & Mindfulness"
        />
        <meta
          name="twitter:description"
          content="Explore guides, tools, and expert content for a healthier lifestyle with Wellness Pure Life."
        />
        <meta
          name="twitter:image"
          content="https://wellnesspurelife.com/images/social-card.jpg"
        />

        {/* Canonical & Favicon */}
        <link rel="canonical" href="https://wellnesspurelife.com/" />
        <link rel="icon" href="/favicon.ico" />

        {/* Structured Data (JSON-LD for Home Page) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Wellness Pure Life",
              url: "https://wellnesspurelife.com/",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://wellnesspurelife.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "Wellness Pure Life",
                logo: {
                  "@type": "ImageObject",
                  url: "https://wellnesspurelife.com/images/logo.png",
                },
              },
            }),
          }}
        />
      </Head>

      {verifyStatus === "success" && (
        <div className={classes.verifyBanner}>
          ✅ Your email has been verified successfully!
          <br />
          <button
            onClick={() => setVerifyStatus(null)}
            className={classes.verifyButton}
          >
            Continue to Home
          </button>
        </div>
      )}

      {verifyStatus && verifyStatus !== "success" && (
        <ResendVerificationModal
          message={verifyStatus}
          email={resendEmail}
          onEmailChange={(e) => setResendEmail(e.target.value)}
          onSubmit={handleResend}
          result={resendResult}
          onClose={() => setVerifyStatus(null)}
        />
      )}

      <main className={classes.container}>
        {/* DAILY LIST */}
        <div
          onMouseEnter={() => {
            gaEvent("home_daily_list_view");
            gaEvent("key_home_daily_list_view");
          }}
        >
          <DailyList />
        </div>

        {/* KEY FEATURES */}
        <div
          onMouseEnter={() => {
            gaEvent("home_key_features_view");
            gaEvent("key_home_key_features_view");
          }}
        >
          <KeyFeatures />
        </div>

        {/* WEEKLY PLAN */}
        <div
          onMouseEnter={() => {
            gaEvent("home_weekly_plan_view");
            gaEvent("key_home_weekly_plan_view");
          }}
        >
          <WeeklyPlanCard />
        </div>

        {/* DAILY ROUTINE */}
        <div
          onMouseEnter={() => {
            gaEvent("home_daily_routine_view");
            gaEvent("key_home_daily_routine_view");
          }}
        >
          <DailyRoutineCard />
        </div>

        {/* SUBSCRIBE — ONLY IF NOT PREMIUM */}
        {!loading && !user?.isPremium && (
          <div
            onMouseEnter={() => {
              gaEvent("home_subscribe_view");
              gaEvent("key_home_subscribe_view");
            }}
          >
            <Subscribe />
          </div>
        )}

        {/* QUIZ CARD */}
        <div
          onMouseEnter={() => {
            gaEvent("home_quiz_card_view");
            gaEvent("key_home_quiz_card_view");
          }}
        >
          <QuizCard />
        </div>

        {/* BLOG CTA */}
        <div
          onMouseEnter={() => {
            gaEvent("home_blog_cta_view");
            gaEvent("key_home_blog_cta_view");
          }}
        >
          <HomeBlogCTA />
        </div>

        {newsArticles.length > 0 && (
          <section className={classes.latestNewsSection}>
            <h2
              className={classes.newsHeading}
              onMouseEnter={() => {
                gaEvent("home_news_heading_view");
                gaEvent("key_home_news_heading_view");
              }}
            >
              Latest Research & Wellness Insights
            </h2>
            <div className={classes.newsGrid} ref={newsGridRef}>
              {newsArticles.map((item) => (
                <div key={item.slug} className={classes.newsCard}>
                  <div className={classes.newsImageWrapper}>
                    <img
                      src={item.image || "/images/defaultNews.jpg"}
                      alt={item.title}
                      className={classes.newsImage}
                    />
                  </div>
                  <div className={classes.newsContent}>
                    <h3 className={classes.newsTitle}>{item.title}</h3>
                    <p className={classes.newsSummary}>{item.summary}</p>
                    <Link
                      href={`/news/${item.slug}`}
                      className={classes.readMore}
                      onClick={() => {
                        gaEvent("home_news_read_more_click", {
                          slug: item.slug,
                          title: item.title,
                        });
                        gaEvent("key_home_news_read_more_click", {
                          slug: item.slug,
                          title: item.title,
                        });
                      }}
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className={classes.progressDots}>
              {newsArticles.map((_, i) => (
                <span
                  key={i}
                  className={`${classes.dot} ${
                    i === activeIndex ? classes.active : ""
                  }`}
                ></span>
              ))}
            </div>

            <div className={classes.arrows}>
              <button
                onClick={() => {
                  gaEvent("home_news_slider_arrow", { direction: "left" });
                  gaEvent("key_home_news_slider_arrow", { direction: "left" });

                  scrollNews("left");
                }}
                className={classes.arrowBtn}
              >
                ◀
              </button>
              <button
                onClick={() => {
                  gaEvent("home_news_slider_arrow", { direction: "right" });
                  gaEvent("key_home_news_slider_arrow", { direction: "right" });

                  scrollNews("right");
                }}
                className={classes.arrowBtn}
              >
                ▶
              </button>
            </div>
          </section>
        )}

        {showButton && (
          <button
            onClick={() => {
              gaEvent("home_scroll_to_top_click");
              gaEvent("key_home_scroll_to_top_click");
              scrollToTop();
            }}
            className={classes.backToTop}
          >
            ↑
          </button>
        )}
      </main>

      {showResetModal && resetToken && (
        <ResetPassword
          token={resetToken}
          onClose={() => {
            setShowResetModal(false);
            router.replace("/");
          }}
        />
      )}
    </>
  );
}
