import { useAuth } from "../context/AuthContext";
import classes from "./PremiumButton.module.css";

export default function PremiumButton() {
  const { user } = useAuth();

  const handleUpgrade = async () => {
    if (!user) return;

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const { url } = await res.json(); // ✅ Consistent with API response
      if (url) {
        window.location.href = url; // ✅ Redirect to Stripe checkout
      } else {
        console.error("No Stripe session URL returned");
      }
    } catch (error) {
      console.error("Error creating Stripe session:", error);
    }
  };

  return (
    <button onClick={handleUpgrade} className={classes.premiumBtn}>
      Upgrade to Premium
    </button>
  );
}
