import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { gaEvent } from "../lib/gtag";
import classes from "./premium-confirmed.module.css";

export default function PremiumConfirmed() {
  useEffect(() => {
    gaEvent("premium_confirm_page_view");
  }, []);

  const { update } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!router.isReady) return;

    const confirmUpgrade = async () => {
      const sessionId = router.query.session_id;
      if (!sessionId) return;
      gaEvent("premium_confirm_start", {
        session_id: sessionId,
      });

      setStatus("updating");

      try {
        // Call backend to confirm and update user's premium status
        const res = await fetch("/api/confirm-premium", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });

        if (!res.ok) throw new Error("API confirmation failed");

        await update(); // Refresh the NextAuth session to include isPremium
        setStatus("success");

        gaEvent("premium_confirm_success", {
          session_id: sessionId,
        });

        setTimeout(() => {
          router.push("/dashboard"); // Redirect to premium feature page
        }, 3000);
      } catch (err) {
        gaEvent("premium_confirm_error", {
          error: err.message,
          session_id: router.query.session_id || null,
        });

        console.error("❌ Error upgrading to premium:", err.message);
        setStatus("error");
      }
    };

    confirmUpgrade();
  }, [router.isReady, router.query.session_id]);

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
