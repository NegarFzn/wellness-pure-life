import Link from "next/link";
import { gaEvent } from "../../lib/gtag";
import classes from "./TopicsColumn.module.css";

export default function TopicsColumn({ label, topicsMap, onLinkClick }) {
  const topics = topicsMap[label] || [];

  const handleClick = (item) => {
    // NORMAL
    gaEvent("header_topic_click", {
      category: label,
      title: item.text,
      href: item.href,
    });
    // ANOMALY
    gaEvent("key_header_topic_click", {
      category: label,
      title: item.text,
      href: item.href,
    });

    onLinkClick?.();
  };

  const handleBrowseAll = () => {
    // NORMAL
    gaEvent("header_browse_all_click", { category: label });
    // ANOMALY
    gaEvent("key_header_browse_all_click", { category: label });

    onLinkClick?.();
  };

  const handleSurprise = () => {
    const all = topics;
    if (all.length > 0) {
      const rand = all[Math.floor(Math.random() * all.length)];

      // NORMAL
      gaEvent("header_surprise_topic", {
        category: label,
        title: rand.text,
        href: rand.href,
      });

      // ANOMALY
      gaEvent("key_header_surprise_topic", {
        category: label,
      });

      if (rand?.href) window.location.href = rand.href;
    }
  };

  return (
    <div className={classes.megaColumn}>
      <h4>
        <Link
          href={`/${label.toLowerCase()}`}
          onClick={() => {
            // NORMAL
            gaEvent("header_section_title_click", { category: label });
            // ANOMALY
            gaEvent("key_header_section_title_click", { category: label });
          }}
        >
          Some {label} Topics
        </Link>
      </h4>

      <ul>
        {topics.length > 0 ? (
          topics.slice(0, 8).map((item, i) => (
            <Link href={item.href} legacyBehavior key={i}>
              <a
                onClick={() => handleClick(item)}
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
        <a onClick={handleBrowseAll} className={classes.browseAllLink}>
          Browse all {label.toLowerCase()} topics →
        </a>
      </Link>

      <button onClick={handleSurprise} className={classes.navBtn}>
        Surprise Me
      </button>
    </div>
  );
}
