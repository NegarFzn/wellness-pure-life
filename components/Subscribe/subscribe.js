import React, { useState } from "react";
import classes from "./subscribe.module.css";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");

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
        body: JSON.stringify({ email, name}),
      });

      const data = await res.json();

      if (res.status === 201) {
        alert("Thank you for subscribing!");
        setEmail("");
        setName("");
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
      <p>Get weekly wellness tips and updates — straight to your inbox!</p>
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
        {/* <select
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          required
        >
          <option value="">Interested in...</option>
          <option value="fitness">Fitness</option>
          <option value="nutrition">Nutrition</option>
          <option value="mindfulness">Mindfulness</option>
        </select> */}
        <button
          type="submit"
          className={classes.subscribeButton}
          onClick={handleSubscribe}
        >
          Subscribe
        </button>
        {message && <p>{message}</p>}
      </form>
    </section>
  );
}
