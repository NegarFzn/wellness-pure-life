import React, { useState } from "react";
import { saveSubscriber } from "../../lib/saveSubscriber";
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
      const result = await saveSubscriber({ email, name });

      if (result.success) {
        setEmail("");
        setName("");
        setSubscribed(true);
        setShowForm(false);
        setMessage("✅ Thank you for subscribing!");
        toast.success("Thank you for subscribing!");
      } else if (result.message.includes("already")) {
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
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setMessage("❌ Error connecting to server.");
      toast.error("Error connecting to server.");
    }
  };

  return (
    <section className={classes.newsletter}>
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

      {/* Show Subscribe Button (before click) */}
      {!showForm && !subscribed && (
        <button
          onClick={handleInitialClick}
          className={classes.subscribeButton}
        >
          Subscribe
        </button>
      )}
      {/* Show Form (after click, before subscribed) */}
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
      {/* Show Subscribed Button (after success) */}
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
