import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useUI } from "../../context/UIContext";
import classes from "./PremiumButton.module.css";

export default function PremiumButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const { closeChat } = useUI();

  const handleUpgrade = () => {
    closeChat();
    router.push("/upgrade");
  };

  return (
    <div className={classes.premiumWrapper}>
      <button onClick={handleUpgrade} className={classes.premiumBtn}>
        Unlock Your Wellness System
      </button>

      <ul className={classes.premiumList}>
        <li className={classes.premiumTitle}>
          ✨ What You Unlock with Premium
        </li>

        <li>🧘 Guided meditations</li>
        <li>🥗 Personalized meal plans</li>
        <li>🤖 AI Wellness Assistant access</li>
        <li>📊 Weekly health progress reports</li>
        <li>🛌 Sleep improvement tracker</li>
        <li>💬 1-on-1 coaching sessions</li>
      </ul>
    </div>
  );
}
