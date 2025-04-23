import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { markUserAsPremium } from "../lib/markUserPremium";

export default function PremiumConfirmed() {
  const { user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
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
  }, [user, router.query.session_id]);

  return (
    <div style={{ padding: "3rem", fontSize: "1.5rem", textAlign: "center" }}>
      {status === "loading" && "⏳ Confirming your Premium membership..."}
      {status === "updating" && "🔄 Finalizing upgrade..."}
      {status === "success" && "🎉 You're now a Premium Member!"}
      {status === "error" &&
        "❌ There was an issue confirming your premium status."}
    </div>
  );
}
