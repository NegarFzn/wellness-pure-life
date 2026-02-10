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

  // PAGE VIEW
  useEffect(() => {
    gaEvent("upgrade_page_view");
    gaEvent("key_upgrade_page_view");
  }, []);

  const handleUpgrade = async () => {
    if (!session) {
      gaEvent("upgrade_require_login");
      gaEvent("key_upgrade_require_login");
      return router.push(`/login?redirect=upgrade&plan=${plan}`);
    }

    setLoading(true);
    setError("");

    try {
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
    <div
      className={classes.overlay}
      onClick={() => {
        gaEvent("upgrade_overlay_back");
        gaEvent("key_upgrade_overlay_back");
        router.back();
      }}
    >
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        {/* CLOSE BUTTON */}
        <button
          className={classes.closeButton}
          onClick={() => {
            gaEvent("upgrade_close_click");
            gaEvent("key_upgrade_close_click");
            router.back();
          }}
        >
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
              clear daily structure...
            </p>

            {/* PRICING SELECT */}
            <div
              className={classes.feeWrapper}
              onMouseEnter={() => {
                gaEvent("upgrade_pricing_view");
                gaEvent("key_upgrade_pricing_view");
              }}
            >
              <label>
                <input
                  type="radio"
                  value="monthly"
                  checked={plan === "monthly"}
                  onChange={() => setPlan("monthly")}
                  onClick={() => {
                    gaEvent("upgrade_plan_select", { plan: "monthly" });
                    gaEvent("key_upgrade_plan_select", { plan: "monthly" });
                  }}
                />
                Monthly – $9.99 / month
              </label>

              <label>
                <input
                  type="radio"
                  value="yearly"
                  checked={plan === "yearly"}
                  onChange={() => setPlan("yearly")}
                  onClick={() => {
                    gaEvent("upgrade_plan_select", { plan: "yearly" });
                    gaEvent("key_upgrade_plan_select", { plan: "yearly" });
                  }}
                />
                Yearly – $79 / year (Save 35%)
              </label>
            </div>

            {/* TIMELINE */}
            <div
              className={classes.timelineBox}
              onMouseEnter={() => {
                gaEvent("upgrade_timeline_view");
                gaEvent("key_upgrade_timeline_view");
              }}
            >
              <h3 className={classes.sectionTitle}>
                What You Will Gain in 30 Days
              </h3>
              <ul className={classes.timelineList}>
                <li>
                  <strong>Week 1:</strong> Immediate clarity...
                </li>
                <li>
                  <strong>Week 2:</strong> Better sleep...
                </li>
                <li>
                  <strong>Week 3:</strong> Consistent habits...
                </li>
                <li>
                  <strong>Week 4:</strong> Improvement...
                </li>
              </ul>
            </div>

            {/* FEATURES LIST */}
            <ul
              className={classes.featureList}
              onMouseEnter={() => {
                gaEvent("upgrade_features_view");
                gaEvent("key_upgrade_features_view");
              }}
            >
              <li className={classes.featureItem}>✔ AI-built daily plan</li>
              <li className={classes.featureItem}>✔ Clarity and calm focus</li>
              <li className={classes.featureItem}>✔ Better sleep</li>
              <li className={classes.featureItem}>✔ Stress control</li>
              <li className={classes.featureItem}>✔ Daily structure</li>

              <li className={classes.featureItem}>✔ Nutrition guidance</li>
              <li className={classes.featureItem}>✔ Mindfulness reminders</li>
              <li className={classes.featureItem}>✔ Weekly progress</li>
              <li className={classes.featureItem}>✔ Daily rituals</li>
              <li className={classes.featureItem}>✔ Wellness analytics</li>
              <li className={classes.featureItem}>✔ Smart recommendations</li>
              <li className={classes.featureItem}>✔ Consistency guidance</li>
              <li className={classes.featureItem}>✔ Premium plans</li>
              <li className={classes.featureItem}>✔ Priority support</li>
            </ul>

            {/* SOCIAL PROOF */}
            <div
              className={classes.socialProofBox}
              onMouseEnter={() => {
                gaEvent("upgrade_social_proof_view");
                gaEvent("key_upgrade_social_proof_view");
              }}
            >
              <h3 className={classes.sectionTitle}>
                Trusted by People Improving Their Life
              </h3>
              <p className={classes.socialProofText}>
                Thousands of people use structured AI wellness systems...
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className={classes.signupFormRight}>
            {error && <p className={classes.errorText}>{error}</p>}

            <p className={classes.trustText}>
              Used by people who want real structure, clarity, and long-term
              control...
            </p>

            <button
              onClick={() => {
                gaEvent("upgrade_checkout_click", { plan });
                gaEvent("key_upgrade_checkout_click", { plan });
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

            <p className={classes.urgencyText}>⚠ Limited early user pricing</p>

            {/* GUARANTEE */}
            <div
              className={classes.guaranteeBox}
              onMouseEnter={() => {
                gaEvent("upgrade_guarantee_view");
                gaEvent("key_upgrade_guarantee_view");
              }}
            >
              <div className={classes.guaranteeBadge}>
                ✓ 100% No-Risk Guarantee
              </div>
              <p className={classes.guaranteeText}>
                If you don’t feel improvement...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
