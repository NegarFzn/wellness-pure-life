import Link from "next/link";
import Image from "next/image";
import classes from "./SpotlightColumn.module.css";

export default function SpotlightColumn({ label, spotlightsMap }) {
  const spotlights = spotlightsMap[label] || [];

  return (
    <div className={classes.megaColumn}>
      <h4>Spotlight</h4>
      {spotlights.length > 0 ? (
        <div className={classes.spotlightGrid}>
          {spotlights.map((item, i) =>
            item.href ? (
              <Link href={item.href} key={i} legacyBehavior>
                <a
                  onClick={() => onLinkClick?.()}
                  className={classes.spotlightItem}
                >
                  <Image
                    src={item.img}
                    alt={item.text}
                    width={70}
                    height={70}
                    className={classes.spotlightImage}
                    unoptimized
                  />
                  <div className={classes.textBlock}>
                    <span className={classes.title}>{item.text}</span>
                    <span className={classes.readTime}>3 min read</span>
                    <div className={classes.labels}>
                      {i === 0 && (
                        <span className={classes.badge}>🔥 Trending</span>
                      )}
                      <span className={classes.categoryTag}>{label}</span>
                    </div>
                  </div>
                </a>
              </Link>
            ) : null
          )}
        </div>
      ) : (
        <div className={classes.spotlightItem}>
          <em>Loading spotlight...</em>
        </div>
      )}
    </div>
  );
}
