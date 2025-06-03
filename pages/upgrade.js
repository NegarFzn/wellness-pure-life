// pages/upgrade.jsx
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import classes from "./upgrade.module.css";

export default function UpgradePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    setError("");

    if (!session && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (!session) {
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (data.url) {
          await signIn("credentials", {
            redirect: false,
            email,
            password,
            name,
          });
          window.location.href = data.url;
        } else {
          setError("Signup failed or checkout session error.");
        }
      } else {
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            uid: session.user.uid,
          }),
        });

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError("Could not initiate Stripe session.");
        }
      }
    } catch (err) {
      console.error("Upgrade error:", err);
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
          <div className={classes.leftInfo}>
            <h1 className={classes.title}>Upgrade to Premium</h1>
            <p className={classes.feeNote}>
              Only <span className={classes.feeHighlight}>$5</span> /month.
              Cancel anytime.
            </p>

            <p className={classes.description}>
              Unlock exclusive wellness challenges, guidance, and mental clarity
              tools.
            </p>
            <ul className={classes.featureList}>
              <li className={classes.featureItem}>
                <span className={classes.checkIcon}>✔</span>Exclusive access to
                AI-powered wellness assistant
              </li>
              <li className={classes.featureItem}>
                <span className={classes.checkIcon}>✔</span>Daily 7-Day
                Challenges
              </li>
              <li className={classes.featureItem}>
                <span className={classes.checkIcon}>✔</span>Premium mindfulness
                tips
              </li>
              <li className={classes.featureItem}>
                <span className={classes.checkIcon}>✔</span>Early access to
                content
              </li>
              <li className={classes.featureItem}>
                <span className={classes.checkIcon}>✔</span>Direct community
                support
              </li>
            </ul>
          </div>

          <div className={classes.signupFormRight}>
            {!session && (
              <>
                <input
                  type="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={classes.input}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={classes.input}
                />
                <input
                  type="password"
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={classes.input}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={classes.input}
                />
              </>
            )}
            {error && <p className={classes.errorText}>{error}</p>}
            <button
              onClick={handleUpgrade}
              className={classes.subscribeButton}
              disabled={loading}
            >
              {loading ? "Processing..." : "Continue & Subscribe"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
