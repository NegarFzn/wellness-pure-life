import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import WeeklyPlan from "../../components/Plan/WeeklyPlan";
import classes from "./weekly-plan.module.css";

export default function WeeklyPlanPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);


  const loadWeeklyPlan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/plan/weekly");
      const data = await res.json();
      setPlan(data.error ? null : data.plan); // FIXED
    } catch (err) {
      console.error("Load Weekly Plan Error:", err);
      setPlan(null);
    }
    setLoading(false);
  };

  const regeneratePlan = async () => {
    setRegenerating(true);
    try {
      const res = await fetch("/api/plan/weekly?regen=1", { method: "POST" });
      const data = await res.json();
      setPlan(data.plan); // FIXED
    } catch (err) {
      console.error("Regenerate Weekly Error:", err);
    }
    setRegenerating(false);
  };

  // Load weekly plan only if authenticated AND premium
  useEffect(() => {
    if (status === "authenticated" && session?.user?.isPremium) {
      loadWeeklyPlan();
    }
  }, [status, session]);

  // ---------------------------
  // AUTH CHECK FLOW (CRITICAL)
  // ---------------------------

  // 1. Session still loading – do NOT render anything else
  if (status === "loading") {
    return <p className={classes.loading}>Checking your session…</p>;
  }

  // 2. No session – user must sign in
  if (!session) {
    return (
      <div className={classes.lockWrap}>
        <h2 className={classes.lockTitle}>Weekly Plan</h2>
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

  // 3. Session exists but NOT premium – show upgrade screen
  if (!session.user?.isPremium) {
    return (
      <div className={classes.lockWrap}>
        <h2 className={classes.lockTitle}>Weekly Plan is a Premium Feature</h2>
        <p className={classes.lockText}>
          Unlock your personalized weekly fitness, mindfulness, and nutrition
          plan.
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

  // ---------------------------
  // PREMIUM USER MAIN PAGE
  // ---------------------------
  return (
    <>
      <Head>
        <title>Your Weekly Plan | Wellness Pure Life</title>
      </Head>

      <div className={classes.page}>
        <h1 className={classes.title}>Your Weekly Wellness Plan</h1>
        <p className={classes.subtitle}>Fitness • Mindfulness • Nutrition</p>

        <button
          onClick={regeneratePlan}
          className={classes.regenButton}
          disabled={regenerating}
        >
          {regenerating ? "Updating…" : "Regenerate Weekly Plan"}
        </button>

        {loading ? (
          <p className={classes.loading}>Loading your plan…</p>
        ) : !plan ? (
          <p className={classes.loading}>No weekly plan available.</p>
        ) : (
          <div className={classes.days}>
            {Object.entries(plan).map(([day, data]) => (
              <WeeklyPlan key={day} day={day} data={data} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
