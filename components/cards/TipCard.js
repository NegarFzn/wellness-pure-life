import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import classes from "./TipCard.module.css";

export default function TipCard() {
  const { data: session } = useSession();
  const user = session?.user;
  const isPremium = user?.isPremium || false;

  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  const todayKey = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!session) return; // ✅ wait until session loads
    if (!isPremium) {
      setLoading(false); // ✅ don't stay stuck in "Loading..."
      return;
    }

    const fetchTip = async () => {
      const cached = localStorage.getItem("dailyWellnessTip");
      const parsed = cached ? JSON.parse(cached) : null;

      if (parsed && parsed.date === todayKey) {
        setTip(parsed.tip);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/daily-tip");
        const data = await res.json();
        console.log("API response:", data);

        if (res.ok && data.tip) {
          setTip(data.tip);
          localStorage.setItem(
            "dailyWellnessTip",
            JSON.stringify({ date: todayKey, tip: data.tip })
          );
        } else {
          console.warn("No tip from API, using cached if available.");
          setTip(parsed?.tip || null);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setTip(parsed?.tip || null);
      } finally {
        setLoading(false);
      }
    };

    fetchTip();
  }, [session, isPremium, todayKey]); // ✅ Added session to dependency array

  return (
    <div className={classes.tipContainer}>
      <div
        className={classes.headerContainer}
        onClick={() => setVisible(!visible)}
      >
        <div>
          <h2 className={classes.heading}>
            🌿 Daily Wellness Tip
            <span
              className={`${classes.toggleIcon} ${visible ? classes.open : ""}`}
            >
              ▼
            </span>
          </h2>
          <p className={classes.subheading}>
            A simple idea to help you feel better today
          </p>
        </div>
      </div>

      <AnimatePresence>
        {visible && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {!isPremium ? (
              <>
                <p className={classes.locked}>
                  🔐 <strong>Premium Tip:</strong> Unlock daily insights to
                  improve focus, reduce stress, and reset your mindset.
                </p>
                <p className={classes.socialProof}>
                  🌟 Join 4,000+ members leveling up their wellness journey.
                </p>
                <a href="/upgrade" className={classes.upgradeButton}>
                  🌟 Upgrade to Premium
                </a>
              </>
            ) : loading ? (
              <p className={classes.loading}>Loading...</p>
            ) : tip ? (
              <p>{tip}</p>
            ) : (
              <p className={classes.loading}>No tip available right now.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
