import React, { useState } from "react";
import { toast } from "react-hot-toast";
import classes from "./subscribe.module.css";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleInitialClick = () => {
    setShowForm(true);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    setMessage("⏳ Subscribing...");

    try {
      const res = await fetch("/api/auth/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const result = await res.json();

      if (res.status === 201) {
        setEmail("");
        setName("");
        setSubscribed(true);
        setShowForm(false);
        setMessage("✅ Thank you for subscribing!");
        toast.success("Thank you for subscribing!");
      } else if (res.status === 409) {
        setSubscribed(true);
        setShowForm(false);
        setEmail("");
        setName("");
        setMessage(
          "✅ You're already on our list! Thanks for staying connected with Wellness Pure Life 💚"
        );
        toast.success("You're already subscribed.");
      } else {
        setMessage(result.message || "Something went wrong.");
        toast.error(result.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setMessage("❌ Error connecting to server.");
      toast.error("Error connecting to server.");
    }
  };

  return (
    <section className={classes.newsletter}>
      <div className={classes.textBlock}>
        <h2>Stay Inspired, Stay Healthy</h2>
        {!subscribed && (
          <p>Get weekly wellness tips and updates — straight to your inbox!</p>
        )}
        {subscribed && (
          <p>
            {message.includes("already")
              ? "✅ You're already on our list!💚"
              : "✅ Thank you for subscribing!"}
          </p>
        )}
      </div>

      {!showForm && !subscribed && (
        <button
          onClick={handleInitialClick}
          className={classes.subscribeButton}
          aria-label="Subscribe to weekly wellness tips"
        >
          Subscribe
        </button>
      )}

      {showForm && (
        <form className={classes.newsletterForm} onSubmit={handleSubscribe}>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className={classes.subscribeButton}>
            Subscribe
          </button>
          {message && <p className={classes.errorMessage}>{message}</p>}
        </form>
      )}

      {subscribed && !showForm && (
        <div className={classes.subscribedContainer}>
          <button
            className={`${classes.subscribeButton} ${
              subscribed ? classes.subscribed : ""
            }`}
            disabled
          >
            Subscribed
          </button>
        </div>
      )}
    </section>
  );
}
