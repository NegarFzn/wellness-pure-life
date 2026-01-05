import Link from "next/link";
import classes from "./ChallengeCard.module.css";

export default function ChallengeCard({
  title,
  description,
  href,
  color = "#7A41FF", // default premium purple
}) {
  return (
    <Link href={href} className={classes.wrapper}>
      <div className={classes.card}>
        <span className={classes.badge} >
          Challenge
        </span>

        <h3 className={classes.title}>{title}</h3>

        <p className={classes.description}>{description}</p>

        <div className={classes.cta} style={{ color }}>
          Try It Today →
        </div>
      </div>
    </Link>
  );
}
