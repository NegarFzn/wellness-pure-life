import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import classes from "./subscribe.module.css";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [emailStatus, setEmailStatus] = useState(null);

  useEffect(() => {
    gaEvent("subscribe_page_view", {
      category: "subscribe",
      label: "static_subscribe_section",
    });
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleInitialClick = () => {
    gaEvent("subscribe_cta_click", {
      category: "subscribe",
      label: "start_7day_plan",
    });
    setShowForm(true);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    gaEvent("subscribe_attempt", {
      category: "subscribe",
      label: "form_submit",
    });

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailStatus("error");
      return;
    }

    // Name validation
    if (!name.trim()) {
      setEmailStatus("error");
      return;
    }

    setLoading(true);
    setEmailStatus(null);

    try {
      const res = await fetch("/api/auth/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          source: "static-subscribe",
        }),
      });

      const result = await res.json();

      // Already subscribed case
      if (res.ok && result.message?.toLowerCase().includes("already")) {
        setEmailStatus("already");
        setSubscribed(true);
        setShowForm(false);
        toast.success("You are already part of the journey.");
      }

      // New subscriber case
      else if (res.ok) {
        setEmailStatus("success");
        setSubscribed(true);
        setShowForm(false);
        setEmail("");
        setName("");
        toast.success("Your premium wellness journey has begun.");
      }

      // Any server error
      else {
        setEmailStatus("error");
        toast.error(result.message || "Subscription failed.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setEmailStatus("error");
      toast.error("Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={classes.newsletter}>
      <div className={classes.glassCard}>
        <div className={classes.textBlock}>
          <h2>Unlock Your Personalized Wellness Journey</h2>

          {!subscribed && (
            <p>
              Receive your private 7-day transformation experience — crafted for
              your body, mind, and lifestyle.
            </p>
          )}

          {/* ========== SUCCESS MESSAGE ========== */}
          {subscribed && emailStatus === "success" && (
            <div className={classes.successBox}>
              <div className={classes.checkmark}>✓</div>
              <p className={classes.emailStatusSuccess}>
                ✅ Your free 7-day wellness plan is on its way. Please check
                your inbox.
              </p>
            </div>
          )}

          {/* ========== ALREADY SUBSCRIBED MESSAGE ========== */}
          {subscribed && emailStatus === "already" && (
            <p className={classes.emailStatusInfo}>
              ℹ️ You’re already enrolled in the free 7-day journey. Your next
              email is on the way.
            </p>
          )}
        </div>

        {/* ========== SHOW CTA BEFORE FORM ========== */}
        {!showForm && !subscribed && (
          <button
            onClick={handleInitialClick}
            className={classes.subscribeButton}
            aria-label="Subscribe to premium wellness funnel"
          >
            Start My Free 7-Day Plan
          </button>
        )}
        <div className={classes.freeBadge}>
          ✅ Free • No Credit Card Required • Cancel Anytime
        </div>

        {/* ========== FORM ========== */}
        {showForm && (
          <form className={classes.newsletterForm} onSubmit={handleSubscribe}>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)} // ALWAYS EDITABLE
              required
              disabled={loading} // NOT locked by session
            />

            <input
              type="email"
              name="email"
              placeholder="Your private email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || !!session?.user?.email}
            />

            <button
              type="submit"
              className={`${classes.subscribeButton} ${
                loading ? classes.loading : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className={classes.spinner}></span>
              ) : (
                "Start Free 7-Day Journey"
              )}
            </button>

            {emailStatus === "error" && (
              <p className={classes.errorMessage}>
                ❌ Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}

        {/* ========== FINAL DISABLED BUTTON AFTER SUBSCRIBED ========== */}
        {subscribed && !showForm && (
          <div className={classes.subscribedContainer}>
            <button
              className={`${classes.subscribeButton} ${classes.subscribed}`}
              disabled
            >
              Free Access Activated
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
