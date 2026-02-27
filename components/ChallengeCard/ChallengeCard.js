import Link from "next/link";
import { gaEvent } from "../../lib/gtag"; // ✅ analytics
import classes from "./ChallengeCard.module.css";

export default function ChallengeCard({
  title,
  description,
  href,
  color = "#7A41FF",
}) {
  return (
    <Link
      href={href}
      className={classes.wrapper}
      onClick={() => {
        gaEvent("challenge_card_click", { title, href });
        gaEvent("key_challenge_card_click", { title, href });
      }}
    >
      <div className={classes.card}>
        <span className={classes.badge}>Challenge</span>

        <h3 className={classes.title}>{title}</h3>

        <p className={classes.description}>{description}</p>

        <div className={classes.cta} style={{ color }}>
          Try It Todayy →
        </div>
      </div>
    </Link>
  );
}
