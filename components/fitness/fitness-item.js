import Image from "next/image";
import Link from "next/link";
import classes from "./fitness-item.module.css";

function stripForCard(text = "") {
  return String(text)
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/--(.*?)--/g, "$1")
    .replace(/\^\^(.*?)\^\^/g, "$1")
    .replace(
      /\b(Overview|Benefits and Considerations|Tips for Best Results|Variations|Background and Context|Encouragement)\s*:\s*/gi,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();
}
function shorten(text = "", max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}
function shortenTitle(text = "", max = 60) {
  return shorten(text, max);
}

export default function FitnessItem({ title, image, summary, intro, id }) {
  const shortTitle = shortenTitle(title, 60);
  const cleanSummary = stripForCard(summary || intro || "");
  const shortSummary = shorten(cleanSummary, 140);

  return (
    <li className={classes.card}>
      <Link href={`/fitness/${id}`} className={classes.cardLink}>
        <div className={classes.media}>
          <Image
            src={image ? `/images/${image}` : "/images/placeholderFit.jpg"}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
          <span className={classes.mediaOverlay} />
        </div>

        <div className={classes.content}>
          <h3 className={classes.title} title={title}>
            {shortTitle}
          </h3>
          <p className={classes.summary} title={cleanSummary}>
            {shortSummary}
          </p>
          <span className={classes.cta}>
            Read more <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}
