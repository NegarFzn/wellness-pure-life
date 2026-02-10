import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useUI } from "../../context/UIContext";
import { useEffect } from "react";
import { gaEvent } from "../../lib/gtag";
import classes from "./PremiumButton.module.css";

export default function PremiumButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const { closeChat } = useUI();

  // CTA impression tracking + anomaly
  useEffect(() => {
    gaEvent("premium_cta_view", { page: router.pathname });
    gaEvent("key_premium_cta_view", { page: router.pathname });
  }, []);

  const handleUpgrade = () => {
    // CTA click tracking + anomaly
    gaEvent("premium_cta_click", {
      page: router.pathname,
      userPremium: session?.user?.isPremium === true,
    });
    gaEvent("key_premium_cta_click", {
      page: router.pathname,
      userPremium: session?.user?.isPremium === true,
    });

    closeChat();
    router.push("/upgrade");
  };

  const benefits = [
    "Guided meditations",
    "Personalized meal plans",
    "AI Wellness Assistant access",
    "Weekly health progress reports",
    "Sleep improvement tracker",
    "1-on-1 coaching sessions",
  ];

  return (
    <div className={classes.premiumWrapper}>
      <button
        onClick={handleUpgrade}
        className={classes.premiumBtn}
        onMouseEnter={() => {
          gaEvent("premium_cta_hover", { page: router.pathname });
          gaEvent("key_premium_cta_hover", { page: router.pathname });
        }}
      >
        Unlock Your Wellness System
      </button>

      <ul className={classes.premiumList}>
        <li className={classes.premiumTitle}>
          ✨ What You Unlock with Premium
        </li>

        {benefits.map((b, i) => (
          <li
            key={i}
            onMouseEnter={() => {
              gaEvent("premium_benefit_view", { benefit: b, index: i });
              gaEvent("key_premium_benefit_view", { benefit: b, index: i });
            }}
          >
            {b === "Guided meditations" && "🧘 "}
            {b === "Personalized meal plans" && "🥗 "}
            {b === "AI Wellness Assistant access" && "🤖 "}
            {b === "Weekly health progress reports" && "📊 "}
            {b === "Sleep improvement tracker" && "🛌 "}
            {b === "1-on-1 coaching sessions" && "💬 "}
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
