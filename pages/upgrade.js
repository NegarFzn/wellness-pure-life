import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { gaEvent } from "../lib/gtag";
import classes from "./upgrade.module.css";

export default function UpgradePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("monthly");

  useEffect(() => {
    gaEvent("upgrade_page_view");
  }, []);

  const handleUpgrade = async () => {
    // 1) REQUIRE LOGIN — redirect to your login page
    if (!session) {
      gaEvent("upgrade_require_login");
      return router.push(`/login?redirect=upgrade&plan=${plan}`);
    }

    setLoading(true);
    setError("");

    try {
      // 2) STRIPE CHECKOUT for logged-in user
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          uid: session.user.uid,
          plan,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Checkout session failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Upgrade failed. Try again later.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className={classes.overlay} onClick={() => router.back()}>
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        <button className={classes.closeButton} onClick={() => router.back()}>
          &times;
        </button>

        <div className={classes.modalContentSplit}>
          {/* LEFT SIDE */}
          <div className={classes.leftInfo}>
            <h1 className={classes.title}>
              Your Personalized System for Energy, Focus, and Peace of Mind
            </h1>

            <p className={classes.description}>
              Stop guessing what to do for your health. This system gives you a
              clear daily structure for your body, mind, sleep, habits, and
              energy — built specifically for you.
            </p>

            {/* PRICING SELECT */}
            <div className={classes.feeWrapper}>
              <label>
                <input
                  type="radio"
                  value="monthly"
                  checked={plan === "monthly"}
                  onChange={() => setPlan("monthly")}
                  onClick={() =>
                    gaEvent("upgrade_plan_select", { plan: "monthly" })
                  }
                />
                Monthly – $9.99 / month
              </label>

              <label>
                <input
                  type="radio"
                  value="yearly"
                  checked={plan === "yearly"}
                  onChange={() => setPlan("yearly")}
                  onClick={() =>
                    gaEvent("upgrade_plan_select", { plan: "yearly" })
                  }
                />
                Yearly – $79 / year (Save 35%)
              </label>
            </div>

            {/* 30-DAY TRANSFORMATION TIMELINE */}
            <div className={classes.timelineBox}>
              <h3 className={classes.sectionTitle}>
                What You Will Gain in 30 Days
              </h3>
              <ul className={classes.timelineList}>
                <li>
                  <strong>Week 1:</strong> Immediate clarity, structure & lower
                  stress
                </li>
                <li>
                  <strong>Week 2:</strong> Better sleep & stronger morning
                  energy
                </li>
                <li>
                  <strong>Week 3:</strong> Consistent habits with AI reminders
                </li>
                <li>
                  <strong>Week 4:</strong> Noticeable improvement in focus &
                  discipline
                </li>
              </ul>
            </div>

            {/* FEATURES */}
            <ul className={classes.featureList}>
              <li className={classes.featureItem}>
                ✔ AI-built daily plan based on your real lifestyle
              </li>
              <li className={classes.featureItem}>
                ✔ Mental clarity and calm focus within days
              </li>
              <li className={classes.featureItem}>
                ✔ Better sleep and stronger morning energy
              </li>
              <li className={classes.featureItem}>
                ✔ Stress control without medication
              </li>
              <li className={classes.featureItem}>
                ✔ A clear structure for your daily life
              </li>

              {/* PREMIUM ADDITIONAL FEATURES */}
              <li className={classes.featureItem}>
                ✔ Personalized nutrition and meal guidance
              </li>
              <li className={classes.featureItem}>
                ✔ Mindfulness reminders based on your stress level
              </li>
              <li className={classes.featureItem}>
                ✔ Weekly progress reports tailored to your habits
              </li>
              <li className={classes.featureItem}>
                ✔ AI-generated daily rituals for balance
              </li>
              <li className={classes.featureItem}>
                ✔ Advanced wellness insights and analytics
              </li>
              <li className={classes.featureItem}>
                ✔ Smart recommendations based on your mood & sleep
              </li>
              <li className={classes.featureItem}>
                ✔ Step-by-step guidance to build consistency
              </li>
              <li className={classes.featureItem}>
                ✔ Exclusive premium content and structured plans
              </li>
              <li className={classes.featureItem}>
                ✔ Priority support for premium members
              </li>
            </ul>

            {/* SOCIAL PROOF */}
            <div className={classes.socialProofBox}>
              <h3 className={classes.sectionTitle}>
                Trusted by People Improving Their Life
              </h3>
              <p className={classes.socialProofText}>
                Thousands of people use structured AI wellness systems to become
                calmer, more energized, and more in control — without relying on
                motivation.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className={classes.signupFormRight}>
            {error && <p className={classes.errorText}>{error}</p>}

            <p className={classes.trustText}>
              Used by people who want real structure, clarity, and long-term
              control over their health — not short-term motivation.
            </p>

            <button
              onClick={() => {
                gaEvent("upgrade_checkout_click", { plan });
                handleUpgrade();
              }}
              className={classes.subscribeButton}
              disabled={loading}
            >
              {loading
                ? "Building your personal system..."
                : "Unlock My Personal System"}
            </button>

            <p className={classes.secureNote}>
              Secure payment • Cancel anytime • Instant access
            </p>

            <p className={classes.urgencyText}>
              ⚠ Limited early user pricing — may increase soon
            </p>

            {/* GUARANTEE SECTION */}
            <div className={classes.guaranteeBox}>
              <div className={classes.guaranteeBadge}>
                ✓ 100% No-Risk Guarantee
              </div>
              <p className={classes.guaranteeText}>
                If you don’t feel improvement in your clarity, energy, and
                structure, you can cancel anytime. Your wellness system is fully
                flexible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
