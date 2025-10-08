import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import MultiPlanSummary from "../../../components/Quiz/QuizPlan/4_PlanSummary";
import classes from "./PlanPage.module.css";

export default function MultiPlanPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { slug } = router.query;

  const [answers, setAnswers] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (!slug || status === "loading") return;

    const fetchPlanData = async () => {
      try {
        let parsed = null;
        const userEmail = session?.user?.email || null;

        // 1. Try MongoDB if logged in
        if (userEmail) {
          const res = await fetch(
            `/api/quiz/quiz-plan?slug=${slug}&email=${encodeURIComponent(
              userEmail
            )}`
          );
          if (res.ok) {
            const data = await res.json();
            parsed = data?.answers || null;
          }
        }

        // 2. Fallback to sessionStorage (not localStorage, since QuizEngine saves here:contentReference[oaicite:1]{index=1})
        if (!parsed && typeof window !== "undefined") {
          const stored = sessionStorage.getItem(`${slug}_plan_answers`);
          if (stored) {
            try {
              parsed = JSON.parse(stored);
            } catch {
              setErrMsg("Saved answers are corrupted. Please retake the quiz.");
              setLoading(false);
              return;
            }
          }
        }

        if (!parsed) {
          setErrMsg("No saved answers found. Please take the quiz first.");
          setLoading(false);
          return;
        }

        setAnswers(parsed);

        // 3. Fetch questions
        const qRes = await fetch("/api/quiz/quiz-plan?mode=questions");
        if (!qRes.ok) throw new Error("Failed to fetch quiz questions");
        const qData = await qRes.json();

        let normalized = [];
        if (Array.isArray(qData)) {
          const doc = qData.find((d) => (d?.slug || "").toLowerCase() === slug);
          normalized = doc?.questions || [];
        } else if (qData?.questions) {
          normalized = qData.questions;
        }
        setQuestions(normalized);
      } catch (error) {
        console.error("Error loading plan page:", error);
        setErrMsg("Something went wrong while loading your plan.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [slug, status, session]);

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <p className={classes.loadingText}>Loading your plan...</p>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className={classes.errorContainer}>
        <p className={classes.errorText}>{errMsg}</p>
        <button
          className={classes.retryButton}
          onClick={() => router.push(`/quizzes/quiz-plan?slug=${slug}`)}
        >
          ← Take the Quiz Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {slug
            ? `${slug} Plan | Wellness Pure Life`
            : "Wellness Plan | Wellness Pure Life"}
        </title>
        <meta
          name="description"
          content="Explore your personalized wellness plan crafted from your quiz responses. Start your journey to a healthier you."
        />

        {/* Open Graph (for social sharing) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wellness Pure Life" />
        <meta
          property="og:title"
          content={
            slug
              ? `${slug} Plan | Wellness Pure Life`
              : "Wellness Plan | Wellness Pure Life"
          }
        />
        <meta
          property="og:description"
          content="Explore your personalized wellness plan crafted from your quiz responses. Start your journey to a healthier you."
        />
        <meta
          property="og:image"
          content="https://wellnesspurelife.com/images/social-card.jpg"
        />
        <meta
          property="og:url"
          content={`https://wellnesspurelife.com/quizzes/quiz-plan/${
            slug || ""
          }`}
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={
            slug
              ? `${slug} Plan | Wellness Pure Life`
              : "Wellness Plan | Wellness Pure Life"
          }
        />
        <meta
          name="twitter:description"
          content="Explore your personalized wellness plan crafted from your quiz responses. Start your journey to a healthier you."
        />
        <meta
          name="twitter:image"
          content="https://wellnesspurelife.com/images/social-card.jpg"
        />

        {/* Canonical & Favicon */}
        <link
          rel="canonical"
          href={`https://wellnesspurelife.com/quizzes/quiz-plan/${slug || ""}`}
        />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://wellnesspurelife.com/quizzes/quiz-plan/${
                  slug || ""
                }`,
              },
              headline: slug
                ? `${slug} Wellness Plan`
                : "Wellness Plan | Wellness Pure Life",
              description:
                "Explore your personalized wellness plan crafted from your quiz responses. Start your journey to a healthier you.",
              image: "https://wellnesspurelife.com/images/social-card.jpg",
              author: {
                "@type": "Organization",
                name: "Wellness Pure Life",
                url: "https://wellnesspurelife.com",
              },
              publisher: {
                "@type": "Organization",
                name: "Wellness Pure Life",
                logo: {
                  "@type": "ImageObject",
                  url: "https://wellnesspurelife.com/images/logo.jpg",
                },
              },
              datePublished: new Date().toISOString(),
              dateModified: new Date().toISOString(),
            }),
          }}
        />
      </Head>{" "}
      <div className={classes.planContainer}>
        <MultiPlanSummary slug={slug} answers={answers} questions={questions} />
      </div>
    </>
  );
}
