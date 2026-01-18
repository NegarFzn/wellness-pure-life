import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { gaEvent } from "../../lib/gtag";
import classes from "./DailyRoutineCard.module.css";
import { FiSun, FiArrowRightCircle } from "react-icons/fi";

export default function DailyRoutineCard({ className = "" }) {
  const { data: session } = useSession();
  const router = useRouter();

  const isAuthenticated = !!session;
  const isPremium = session?.user?.isPremium === true;

  const buttonText = !isAuthenticated
    ? "Sign In to Continue"
    : !isPremium
    ? "Upgrade to Premium"
    : "View Today’s Routine";

  const handleClick = () => {
    gaEvent("daily_routine_card_click", {
      status: !isAuthenticated
        ? "not_authenticated"
        : !isPremium
        ? "not_premium"
        : "premium",
    });

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isPremium) {
      router.push("/premium");
      return;
    }

    router.push("/plan/daily-routine");
  };

  useEffect(() => {
    gaEvent("daily_routine_card_view", {
      is_authenticated: !!session,
      is_premium: session?.user?.isPremium === true,
    });
  }, [session]);

  return (
    <div className={`${classes.card} ${className}`} onClick={handleClick}>
      <div className={classes.iconWrap}>
        <FiSun className={classes.icon} />
      </div>

      <div className={classes.content}>
        {/* ✅ PURPOSE LABEL */}
        <span className={classes.label}>PERSONALIZED • TODAY</span>

        <h3 className={classes.title}>Your Daily Wellness Routine</h3>

        <p className={classes.desc}>
          A structured daily flow for morning, midday, and evening—designed from
          your habits, goals, and wellness profile.
        </p>

        {/* ✅ STATUS / TRUST LINE */}
        <p className={classes.meta}>
          • Personalized for today • Morning • Midday • Evening
        </p>

        {/* ✅ CTA */}
        <button
          className={classes.button}
          onClick={(e) => {
            e.stopPropagation(); // prevents the whole card click from overriding

            gaEvent("daily_routine_card_cta_click", {
              status: !isAuthenticated
                ? "not_authenticated"
                : !isPremium
                ? "not_premium"
                : "premium",
            });

            handleClick(); // continue original flow
          }}
        >
          <span>{buttonText}</span>
          <FiArrowRightCircle className={classes.buttonIcon} />
        </button>
      </div>
    </div>
  );
}
