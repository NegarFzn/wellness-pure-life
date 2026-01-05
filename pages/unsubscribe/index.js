import { useState } from "react";
import classes from "./unsubscribe.module.css";

export default function UnsubscribePage() {
  const [status, setStatus] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUnsubscribe(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setStatus(data.message || "You have been unsubscribed.");
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={classes.page}>
      <div className={classes.card}>
        <h1 className={classes.title}>Unsubscribe</h1>

        <p className={classes.subtitle}>
          You can stop receiving wellness emails at any time.
        </p>

        <form onSubmit={handleUnsubscribe} className={classes.form}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={classes.input}
          />

          <button type="submit" className={classes.button} disabled={loading}>
            {loading ? "Processing..." : "Unsubscribe"}
          </button>
        </form>

        {status && <p className={classes.status}>{status}</p>}

        <p className={classes.footerNote}>
          If this was a mistake, you can always rejoin from our website.
        </p>
      </div>
    </div>
  );
}
