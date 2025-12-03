import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import DailyRoutine from "../../components/Plan/DailyRoutine";
import classes from "./daily-routine.module.css";

export default function DailyRoutinePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ------------------------------
  // HOOKS (must always be first)
  // ------------------------------
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");

  // ------------------------------
  // Fetch daily plan
  // ------------------------------
  const loadDailyPlan = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/plan/daily");
      const data = await res.json();

      // 🔥 If API returns error => Do NOT load plan → triggers lock screen
      if (data.error) {
        setPlan(null);
        return;
      }

      setPlan(data.plan || null);
    } catch (err) {
      console.error("Daily plan fetch failed:", err);
      setPlan(null);
    }

    setLoading(false);
  };

  // ------------------------------
  // Regenerate daily plan
  // ------------------------------
  const regeneratePlan = async () => {
    setRegenerating(true);
    setError("");

    try {
      const res = await fetch("/api/plan/daily?regen=1", { method: "POST" });
      const data = await res.json();

      if (data.error) {
        setError("Routine regeneration failed. Please try again.");
      } else {
        setPlan(data.plan || null); // FIXED
      }
    } catch (err) {
      setError("Routine regeneration failed. Please try again.");
    }

    setRegenerating(false);
  };

  // ------------------------------
  // Load only when authenticated AND premium
  // ------------------------------
  useEffect(() => {
    if (status === "authenticated" && session?.user?.isPremium) {
      loadDailyPlan();
    }
  }, [status, session]);

  // ------------------------------
  // CONDITIONAL RENDERING
  // ------------------------------

  // Status unknown
  if (status === "loading") {
    return <p className={classes.loading}>Checking your session…</p>;
  }

  // Not logged in
  if (!session) {
    return (
      <div className={classes.lockWrap}>
        <h2 className={classes.lockTitle}>Daily Routine</h2>
        <p className={classes.lockText}>Please sign in to continue.</p>
        <button
          onClick={() => router.push("/auth")}
          className={classes.lockButton}
        >
          Sign In
        </button>
      </div>
    );
  }

  // Logged in but NOT premium
  if (!session.user?.isPremium) {
    return (
      <div className={classes.lockWrap}>
        <h2 className={classes.lockTitle}>
          Daily Routine is a Premium Feature
        </h2>

        <p className={classes.lockText}>
          Unlock your personalized morning, midday, and evening wellness
          structure. A daily system made just for you.
        </p>

        <button
          onClick={() => router.push("/premium")}
          className={classes.lockButton}
        >
          Upgrade to Premium
        </button>
      </div>
    );
  }

  // ------------------------------
  // MAIN PAGE (PREMIUM ONLY)
  // ------------------------------
  return (
    <>
      <Head>
        <title>Your Daily Routine | Wellness Pure Life</title>
      </Head>

      <div className={classes.page}>
        <h1 className={classes.title}>Your Daily Routine</h1>
        <p className={classes.subtitle}>
          A structured daily system designed to support your energy, focus, and
          emotional well-being.
        </p>

        <button
          onClick={regeneratePlan}
          className={classes.refreshButton}
          disabled={regenerating}
        >
          {regenerating ? "Updating…" : "Regenerate Daily Routine"}
        </button>

        {loading ? (
          <p className={classes.loading}>Loading your routine…</p>
        ) : !plan ? (
          <p className={classes.loading}>No routine available.</p>
        ) : (
          <div className={classes.sections}>
            <DailyRoutine label="Morning" data={plan.morning} />
            <DailyRoutine label="Midday" data={plan.midday} />
            <DailyRoutine label="Evening" data={plan.evening} />
          </div>
        )}

        {error && <p className={classes.error}>{error}</p>}
      </div>
    </>
  );
}
