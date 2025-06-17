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
    <button onClick={handleUpgrade} className={classes.premiumBtn}>
      Upgrade to Premium
    </button>
  );
}
