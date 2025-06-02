import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import classes from "./PremiumButton.module.css";

export default function PremiumButton() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleUpgrade = () => {
    router.push("/upgrade");
  };

  return (
    <button onClick={handleUpgrade} className={classes.premiumBtn}>
      Upgrade to Premium
    </button>
  );
}
