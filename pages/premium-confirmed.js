import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { markUserAsPremium } from "../lib/markUserPremium";
import classes from "./premium-confirmed.module.css";

export default function PremiumConfirmed() {
  const { user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!router.isReady) return;

    const confirmUpgrade = async () => {
      const sessionId = router.query.session_id;
      if (user && sessionId) {
        setStatus("updating");
        try {
          await markUserAsPremium(user.uid, user.email);
          setStatus("success");
        } catch (err) {
          console.error("🔥 Failed to mark as premium:", err.message);
          setStatus("error");
        }
      }
    };

    confirmUpgrade();
  }, [router.isReady, user, router.query.session_id]);

  const getMessage = () => {
    switch (status) {
      case "loading":
        return "⏳ Confirming your Premium membership...";
      case "updating":
        return "🔄 Finalizing upgrade...";
      case "success":
        return "🎉 You're now a Premium Member!";
      case "error":
        return "❌ Something went wrong confirming your upgrade.";
      default:
        return "";
    }
  };

  return (
    <div className={classes.premiumWrapper}>
      <div className={`${classes.premiumCard} ${classes[status]}`}>
        <p>{getMessage()}</p>
      </div>
    </div>
  );
}
