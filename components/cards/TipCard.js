import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import classes from "./TipCard.module.css";

export default function TipCard() {
  const { data: session, status } = useSession();
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  const isPremium = session?.user?.isPremium;

  useEffect(() => {
    if (!isPremium) return;

    const fetchTip = async () => {
      try {
        const res = await fetch("/api/mongo/daily-tip"); // or /ai/daily-tip
        const data = await res.json();
        setTip(data.tip);
      } catch {
        setTip(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTip();
  }, [isPremium]);

  if (status === "loading") return null;

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
