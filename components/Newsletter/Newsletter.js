import React, { useState } from "react";
import classes from "./Newsletter.module.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed with:", email);
    alert("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <section className={classes.newsletter}>
      <h2>Stay Inspired, Stay Healthy</h2>
      <p>Get weekly wellness tips and updates — straight to your inbox!</p>
      <form className={classes.newsletterForm} onSubmit={handleSubscribe}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className={classes.newsletterInput}
        />
        <button type="submit" className={classes.subscribeButton}>
          Subscribe
        </button>
      </form>
    </section>
  );
}
