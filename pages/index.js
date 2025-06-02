import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchNews } from "../utils/fetch";
import Head from "next/head";
import Link from "next/link";
import Subscribe from "../components/Subscribe/subscribe";
import KeyFeatures from "../components/KeyFeatures/KeyFeatures";
import DailyList from "../components/DailyList/DailyList";
import ResetPassword from "../components/Auth/ResetPassword";
import ResendVerificationModal from "../components/Auth/ResendVerificationModal";
import classes from "./index.module.css";

export default function Home() {
  const [newsArticles, setNewsArticles] = useState([]);
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
      setNewsArticles(news.slice(0, 2));
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
        console.log("🔍 Verifying email with token:", verifyToken);
        console.log("before verifying:", verifying);
        setVerifying(true);
        console.log("after verifying:", verifying);
        try {
          const res = await fetch(
            `/api/auth/emailverification?token=${verifyToken}`
          );
          const data = await res.json();
          console.log("📬 Verification response:", data);
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

  const handleResend = async (e) => {
    e.preventDefault();
    console.log("📨 Resend clicked with email:", resendEmail);
    setResendResult(null);
    try {
      const res = await fetch("/api/auth/emailverification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();
      console.log("🔁 Resend response:", data);

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
        <title>Healthy Living - Mind & Body Wellness</title>
        <meta
          name="description"
          content="Achieve a balanced and healthier life with fitness, mindfulness, and nourishing food tips."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
      </Head>

      {/* Verification banners */}

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
        {newsArticles.length > 0 && (
          <section className={classes.latestNewsSection}>
            <div className={classes.newsGrid}>
              {newsArticles.map((item) => (
                <div key={item.slug} className={classes.newsCard}>
                  <img
                    src={
                      item.image && item.image.trim()
                        ? item.image
                        : "/images/defaultNews.jpg"
                    }
                    alt={item.title || "News image"}
                    className={classes.image}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/defaultNews.jpg";
                    }}
                  />
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <Link href={`/news/${item.slug}`} className={classes.readMore}>Read More →</Link>
                </div>
              ))}
            </div>
          </section>
        )}
        {showButton && (
          <button onClick={scrollToTop} className={classes.backToTop}>
            ↑
          </button>
        )}
      </main>
      {/* Password Reset Modal using custom Auth-style */}
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
