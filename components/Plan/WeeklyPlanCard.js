import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { gaEvent } from "../../lib/gtag";
import classes from "./WeeklyPlanCard.module.css";
import { FiCalendar, FiArrowRightCircle } from "react-icons/fi";

export default function WeeklyPlanCard({ className = "" }) {
  const { data: session } = useSession();
  const router = useRouter();

  const isAuthenticated = !!session;
  const isPremium = session?.user?.isPremium === true;

  const buttonText = !isAuthenticated
    ? "Sign In to Continue"
    : !isPremium
    ? "Upgrade to Premium"
    : "View My Weekly Plan";

  const handleClick = () => {
    gaEvent("weekly_plan_card_click", {
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

    router.push("/plan/weekly-plan");
  };

  useEffect(() => {
    gaEvent("weekly_plan_card_view", {
      is_authenticated: !!session,
      is_premium: session?.user?.isPremium === true,
    });
  }, [session]);

  return (
    <div className={`${classes.card} ${className}`} onClick={handleClick}>
      <div className={classes.iconWrap}>
        <FiCalendar className={classes.icon} />
      </div>

      <div className={classes.content}>
        {/* ✅ PURPOSE LABEL */}
        <span className={classes.label}>PERSONALIZED • WEEKLY</span>

        <h3 className={classes.title}>Your Weekly Wellness Plan</h3>

        <p className={classes.desc}>
          A complete weekly structure with movement, rituals, nourishment, and
          focus tasks—built from your quiz responses.
        </p>

        {/* ✅ STATUS LINE */}
        <p className={classes.meta}>
          • Based on your latest quiz results • Updates once per week
        </p>

        {/* ✅ CTA */}
        <button className={classes.button}>
          <span>{buttonText}</span>
          <FiArrowRightCircle className={classes.buttonIcon} />
        </button>
      </div>
    </div>
  );
}
