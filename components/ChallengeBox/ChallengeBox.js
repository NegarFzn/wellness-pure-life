import Link from "next/link";
import classes from "./ChallengeBox.module.css";

export default function ChallengeBox({
  title,
  description,
  href,
  color = "#22c55e", // default green
}) {
  return (
    <Link href={href} passHref className={classes.link}>
      <div className={`${classes.card} group`} style={{ borderColor: color }}>
        <div className={classes.ribbon} style={{ backgroundColor: color }}>
          Challenge
        </div>
        <h3 className={classes.title}>{title}</h3>
        <p className={classes.description}>{description}</p>
        <div className={classes.cta} style={{ color }}>
          Try It Today →
        </div>
      </div>
    </Link>
  );
}
