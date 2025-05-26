import { useSession } from "next-auth/react";
import classes from "./PremiumButton.module.css";

export default function PremiumButton() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const uid = session?.id;

  const handleUpgrade = async () => {
    if (!email || !uid) {
      console.log("User not logged in");
      return;
    }

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, uid }),
    });

    const data = await res.json();
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
