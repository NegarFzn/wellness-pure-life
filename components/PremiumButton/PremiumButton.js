import { useSession } from "next-auth/react";
import classes from "./PremiumButton.module.css";

export default function PremiumButton() {
  const { data: session } = useSession();
  const user = session?.user;

  const handleUpgrade = async () => {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    console.log("🔁 Starting checkout session...");

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, uid: user.id }),
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
