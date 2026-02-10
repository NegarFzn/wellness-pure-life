import { useState, useEffect } from "react";
import { gaEvent } from "../../lib/gtag";
import classes from "./unsubscribe.module.css";

export default function UnsubscribePage() {
  const [status, setStatus] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // PAGE VIEW ANALYTICS + ANOMALY
  useEffect(() => {
    gaEvent("unsubscribe_page_view");
    gaEvent("key_unsubscribe_page_view");
  }, []);

  async function handleUnsubscribe(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // BUTTON CLICK EVENT
    gaEvent("unsubscribe_click", { email });
    gaEvent("key_unsubscribe_click", { email });

    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setStatus(data.message || "You have been unsubscribed.");

      // SUCCESS EVENT
      gaEvent("unsubscribe_success", { email });
      gaEvent("key_unsubscribe_success", { email });
    } catch (err) {
      setStatus("Something went wrong. Please try again.");

      // ERROR EVENT
      gaEvent("unsubscribe_error", { email });
      gaEvent("key_unsubscribe_error", { email });
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
            onChange={(e) => {
              setEmail(e.target.value);

              // EMAIL TYPING EVENT
              gaEvent("unsubscribe_email_typing", { value: e.target.value });
              gaEvent("key_unsubscribe_email_typing", {
                value: e.target.value,
              });
            }}
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
