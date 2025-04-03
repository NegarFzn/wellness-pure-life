import React, { useState } from "react";
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

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();

      if (res.status === 201) {
        alert("Thank you for subscribing!");
        setEmail("");
        setName("");
        setSubscribed(true); // ✅ Mark as subscribed
        setShowForm(false); // ✅ Hide form
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <section className={classes.newsletter}>
      <h2>Stay Inspired, Stay Healthy</h2>
      {!subscribed && <p>Get weekly wellness tips and updates — straight to your inbox!</p>}
      
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
          {message && <p>{message}</p>}
        </form>
      )}
      {/* Show Subscribed Button (after success) */}
      {subscribed && !showForm && (
        <button className={`${classes.subscribeButton} ${subscribed ? classes.subscribed : ""}`} disabled>
          Subscribed
        </button>
      )}
    </section>
  );
}
