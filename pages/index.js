// pages/index.js
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { fetchNews } from "../utils/fetch";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Subscribe from "../components/Subscribe/subscribe";
import KeyFeatures from "../components/KeyFeatures/KeyFeatures";
import DailyList from "../components/DailyList/DailyList";
import ResetPassword from "../components/Auth/ResetPassword";
import ResendVerificationModal from "../components/Auth/ResendVerificationModal";
import QuizCard from "../components/QuizCard/QuizCard";
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
  const { verifyToken, resetToken } = router.query;

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
    if (verifyToken) {
      const verifyEmail = async () => {
        setVerifying(true);
        try {
          const res = await fetch(
            `/api/auth/emailverification?token=${verifyToken}`
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
  }, [verifyToken]);

  useEffect(() => {
    if (resetToken) {
      setShowResetModal(true);
    }
  }, [resetToken]);

  useEffect(() => {
    const container = newsGridRef.current;
    const cards = container?.querySelectorAll(`.${classes.newsCard}`);
    const isHorizontalScroll = window.innerWidth < 1024;
    if (!container || !cards.length || !isHorizontalScroll) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = [...cards].indexOf(entry.target);
            setActiveIndex(index);
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
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
          : `❌ ${data.message}`
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
        <title>Wellness Pure Life - Fitness, Nutrition & Mindfulness</title>
        <meta
          name="description"
          content="Wellness Pure Life helps you thrive with expert tips in fitness, mindfulness, and nutrition. Discover guides, workouts, recipes, and wellness insights."
        />
        <meta
          name="keywords"
          content="fitness, mindfulness, nutrition, wellness, healthy living, workouts, mental health"
        />
        <meta name="robots" content="index, follow" />
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
        <DailyList />
        <KeyFeatures />
        <Subscribe />
        <QuizCard />
        {newsArticles.length > 0 && (
          <section className={classes.latestNewsSection}>
            <h2 className={classes.newsHeading}>
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
                onClick={() => scrollNews("left")}
                className={classes.arrowBtn}
              >
                ◀
              </button>
              <button
                onClick={() => scrollNews("right")}
                className={classes.arrowBtn}
              >
                ▶
              </button>
            </div>
          </section>
        )}

        {showButton && (
          <button onClick={scrollToTop} className={classes.backToTop}>
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
