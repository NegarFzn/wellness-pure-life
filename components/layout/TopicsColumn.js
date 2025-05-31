import Link from "next/link";
import classes from "./TopicsColumn.module.css";

export default function TopicsColumn({ label, topicsMap }) {
  const topics = topicsMap[label] || [];

  return (
    <div className={classes.megaColumn}>
      <h4>
        <Link href={`/${label.toLowerCase()}`}>Some {label} Topics</Link>
      </h4>
      <ul>
        {topics.length > 0 ? (
          topics.slice(0, 8).map((item, i) => (
            <Link href={item.href} legacyBehavior key={i}>
              <a
                onClick={() => onLinkClick?.()}
                className={classes.spotlightItem}
              >
                <div className={classes.textBlock}>
                  <span className={classes.title}>{item.text}</span>
                  <span className={classes.readTime}>3 min read</span>
                </div>
                {i === 0 && <span className={classes.badge}>🔥 Trending</span>}
                <span className={classes.categoryTag}>{label}</span>
              </a>
            </Link>
          ))
        ) : (
          <li>
            <em>Loading topics...</em>
          </li>
        )}
      </ul>
      <Link href={`/${label.toLowerCase()}`} legacyBehavior>
        <a onClick={() => onLinkClick?.()} className={classes.browseAllLink}>
          Browse all {label.toLowerCase()} topics →
        </a>
      </Link>

      <button
        onClick={() => {
          const all = topics;
          if (all.length > 0) {
            const rand = all[Math.floor(Math.random() * all.length)];
            if (rand?.href) window.location.href = rand.href;
          }
        }}
        className={classes.navBtn}
      >
        Surprise Me
      </button>
    </div>
  );
}
