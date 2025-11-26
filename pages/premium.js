import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import classes from "./premium.module.css";

export default function PremiumPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("monthly");

  const handleUpgrade = async () => {
    setLoading(true);
    setError("");

    if (!session && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          session
            ? {
                email: session.user.email,
                uid: session.user.uid,
                plan,
              }
            : { name, email, password, plan }
        ),
      });

      const data = await res.json();

      if (data.url) {
        if (!session) {
          await signIn("credentials", {
            redirect: false,
            email,
            password,
            name,
          });
        }
        window.location.href = data.url;
      } else {
        setError("Checkout session failed.");
      }
    } catch {
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

            <div className={classes.feeWrapper}>
              <label>
                <input
                  type="radio"
                  value="monthly"
                  checked={plan === "monthly"}
                  onChange={() => setPlan("monthly")}
                />
                Monthly – $5 / month
              </label>

              <label>
                <input
                  type="radio"
                  value="yearly"
                  checked={plan === "yearly"}
                  onChange={() => setPlan("yearly")}
                />
                Yearly – $39 / year (Save 35%)
              </label>
            </div>

            <ul className={classes.featureList}>
              <li className={classes.featureItem}>
                ✔ AI-built daily plan based on your real lifestyle
              </li>
              <li className={classes.featureItem}>
                ✔ Mental clarity and calm focus within days
              </li>
              <li className={classes.featureItem}>
                ✔ Better sleep and morning energy
              </li>
              <li className={classes.featureItem}>
                ✔ Stress control without medication
              </li>
              <li className={classes.featureItem}>
                ✔ A clear structure for your daily life
              </li>
            </ul>
          </div>

          {/* RIGHT SIDE */}
          <div className={classes.signupFormRight}>
            {!session && (
              <>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={classes.input}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={classes.input}
                />
                <input
                  type="password"
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={classes.input}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={classes.input}
                />
              </>
            )}

            {error && <p className={classes.errorText}>{error}</p>}

            <p className={classes.trustText}>
              Used by people who want real structure, clarity, and long-term
              control over their health — not short-term motivation.
            </p>

            <button
              onClick={handleUpgrade}
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
          </div>
        </div>
      </div>
    </div>
  );
}
