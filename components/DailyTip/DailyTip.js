import { useEffect, useState } from "react";
import classes from "./DailyTip.module.css";

export default function DailyTip() {
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const res = await fetch("/api/tip");
        const data = await res.json();
        if (data.tip) setTip(data.tip);
      } catch (err) {
        console.error("Failed to fetch tip:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTip();
  }, []);

  return (
    <div className={classes.tipContainer}>
      <h2 className={classes.heading}>🌿 Daily Wellness Tip</h2>
      {loading ? (
        <p className={classes.loading}>Loading...</p>
      ) : tip ? (
        <p>{tip}</p>
      ) : (
        <p className={classes.loading}>No tip available right now.</p>
      )}
    </div>
  );
}
