import { useAuth } from "../../context/AuthContext";
import classes from "./PremiumButton.module.css";

export default function PremiumButton() {
  const { user } = useAuth();

  const handleUpgrade = async () => {
    if (!user) {
      console.log("User not logged in");
      return;
    }
    console.log("🔁 Starting checkout session...");

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    });

    const data = await res.json();
    console.log("🎯 Session URL:", data.url);

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("❌ No session URL returned");
    }
  };

  return (
    <button onClick={handleUpgrade} className={classes.premiumBtn}>
      Upgrade to Premium
    </button>
  );
}
