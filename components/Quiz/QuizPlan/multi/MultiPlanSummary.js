import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import PremiumCallout from "../../../PremiumButton/PremiumCallout";
import ShareButton from "../../../UI/ShareButton";
import classes from "./MultiPlanSummary.module.css";
import Button from "../../../UI/button";

export default function MultiPlanSummary({ answers }) {
  const [showPremium, setShowPremium] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [submitted, setSubmitted] = useState(false);
  const [loadedAnswers, setLoadedAnswers] = useState(null);
  const [labelMap, setLabelMap] = useState({});
  const [matchedPlan, setMatchedPlan] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const slug = router.query.slug;
  const category = slug?.replace("-plan", "");

  const {
    fitnessLevel,
    activityPreference,
    timeCommitment,
    challenges: rawChallenges = [],
  } = loadedAnswers || answers;

  const challenges = Array.isArray(rawChallenges)
    ? rawChallenges
    : rawChallenges
    ? [rawChallenges]
    : [];

  // ⏬ Build ShareButton props dynamically
  const shareTitle = "My Personalized Wellness Plan";

  const shareText = `Check out my personalized wellness plan based on my preferences at Wellness Pure Life.`;

  const shareUrl = `https://wellnesspurelife.com${router.asPath}`;

  // ⏬ Build dynamic label map
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const res = await fetch("/api/quiz/quiz-plan?mode=questions");
        const data = await res.json();
        const quiz = data.find((q) => q.slug === slug);

        const map = {};
        quiz?.questions?.forEach((q) => {
          q.options.forEach((opt) => {
            map[opt.value] = opt.label;
          });
        });

        setLabelMap(map);
      } catch (err) {
        console.error("❌ Failed to fetch label map:", err);
      }
    };

    fetchLabels();
  }, []);

  const formatLabel = (val) => labelMap[val] || val;

  // ✅ Save to MongoDB
  useEffect(() => {
    if (
      status !== "authenticated" ||
      !session?.user?.email ||
      submitted ||
      !answers
    )
      return;

    console.log("🔐 Authenticated. Saving with email:", session.user.email);

    const submitToDB = async () => {
      try {
        const res = await fetch("/api/quiz/quiz-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: "fitness-plan",
            answers,
            email: session.user.email, // ✅ guaranteed email
          }),
        });

        const data = await res.json();
        console.log("✅ Save response:", data);
        setSubmitted(true);
      } catch (err) {
        console.error("❌ Failed to save quiz result:", err);
      }
    };

    submitToDB();
  }, [answers, session?.user?.email, status, submitted]);

  // ✅ Fetch saved answers + plan
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchSavedPlan = async () => {
      try {
        const res = await fetch(
          `/api/quiz/quiz-plan?slug=fitness-plan&email=${encodeURIComponent(
            session.user.email
          )}`
        );

        if (!res.ok) {
          console.warn("No saved plan found.");
          return;
        }

        const data = await res.json();
        console.log("📦 Loaded saved:", data);

        setLoadedAnswers(data.answers);
        setMatchedPlan(data.matchedPlan);
      } catch (err) {
        console.error("❌ Failed to fetch saved plan:", err);
      }
    };

    fetchSavedPlan();
  }, [session?.user?.email, status]);

  useEffect(() => {
    const checkShouldShowPremium = async () => {
      if (session?.user && !session.user.isPremium) {
        try {
          const res = await fetch(`/api/premium-reminder?category=${category}`);
          const data = await res.json();
          setShowPremium(data.show);
        } catch (err) {
          console.error("❌ Failed to check premium reminder:", err);
          setShowPremium(false);
        }
      }
    };

    checkShouldShowPremium();
  }, [session?.user, session?.user?.isPremium, category]);

  const sendPlanToEmail = async () => {
    setIsSending(true);
    setToastMsg(""); // reset message
    try {
      const res = await fetch("/api/quiz/sendEmail-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          answers: loadedAnswers || answers,
          category,
          matchedPlan,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setToastMsg("📧 Plan sent to your email.");
        setEmailSent(true);
      } else {
        setToastMsg("❌ Failed to send email: " + data.error);
      }
    } catch (err) {
      console.error("Email sending error:", err);
      setToastMsg("❌ Failed to send email.");
    } finally {
      setIsSending(false);
      setTimeout(() => setToastMsg(""), 4000); // auto-hide
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>Your Personalized Fitness Plan</h2>

      {matchedPlan?.summary && (
        <p className={classes.subheading}>{matchedPlan.summary}</p>
      )}

      <div className={classes.actionsRow}>
        <div className={classes.utilityButtons}>
          <button
            className={`${classes.utilityButton} ${classes.secondaryButton}`}
            onClick={() => window.print()}
          >
            🖨️ Print
          </button>

          <ShareButton title={shareTitle} text={shareText} url={shareUrl} />

          {session?.user?.email && (
            <button
              className={`${classes.utilityButton} ${classes.secondaryButton}`}
              disabled={isSending || emailSent}
              onClick={sendPlanToEmail}
            >
              {isSending
                ? "Sending..."
                : emailSent
                ? "✅ Sent"
                : "📧 Send to Email"}
            </button>
          )}
        </div>
      </div>

      <div className={classes.summaryList}>
        <p>
          <strong>Fitness Level:</strong> {formatLabel(fitnessLevel)}
        </p>
        <p>
          <strong>Preferred Activity:</strong> {formatLabel(activityPreference)}
        </p>
        <p>
          <strong>Time Commitment:</strong> {formatLabel(timeCommitment)}
        </p>
        <p>
          <strong>Challenges:</strong>
        </p>
        <ul>
          {challenges.length > 0 ? (
            challenges.map((c) => <li key={c}>{formatLabel(c)}</li>)
          ) : (
            <li>None</li>
          )}
        </ul>
      </div>

      {matchedPlan?.structure && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Plan Structure:</strong>
          <ul>
            {matchedPlan.structure.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {!session?.user && (
        <p style={{ marginTop: "1rem" }}>
          Want to save this plan permanently?{" "}
          <Button size="sm" onClick={() => router.push("/auth/login")}>
            Log in or Sign up
          </Button>
        </p>
      )}

      {/* ✅ Extracted reusable Premium block */}
      {session?.user && !session.user.isPremium && showPremium && (
        <PremiumCallout
          category={category}
          onDismiss={async () => {
            await fetch(`/api/premium-reminder?category=${category}`, {
              method: "POST",
            });
            setShowPremium(false);
          }}
        />
      )}

      {toastMsg && <div className={classes.toastBox}>{toastMsg}</div>}
      {submitted && (
        <p className={classes.successMessage}>✔️ Your plan has been saved.</p>
      )}
    </div>
  );
}
