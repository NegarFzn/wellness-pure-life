import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import FeedbackPrompt from "../../components/UI/FeedbackPrompt";
import classes from "./content.module.css";
import FitnessList from "./fitness-list";



/* ------------------------------------------------------
   Enhanced formatter
   - Inline markers kept
   - Lists require ≥ 2 consecutive items
   - Avoids decimals (e.g., 2.0) and single numbered lines
------------------------------------------------------ */
function formatText(text) {
  if (typeof text !== "string") return "";

  // Inline markers
  let t = text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") // **bold**
    .replace(/__(.+?)__/g, '<strong class="colorful">$1</strong>') // __colorful__
    .replace(/--(.+?)--/g, '<span class="larger">$1</span>') // --larger--
    .replace(/\^\^(.+?)\^\^/g, '<span class="smaller">$1</span>'); // ^^smaller^^

  // Internal link shorthands
  t = t.replace(/\[\[mind:(\d+)\]\]/g, (_, id) => {
    return `<a href="/mindfulness/${id}" class="internal-link">Explore mindfulness ${id}</a>`;
  });
  t = t.replace(/\[\[nourish:(\d+)\]\]/g, (_, id) => {
    return `<a href="/nourish/${id}" class="internal-link">Explore nutrition ${id}</a>`;
  });

  // Block parsing
  const lines = t.split(/\r?\n/);
  const out = [];
  let i = 0;

  const flushParagraph = (buf) => {
    if (!buf.length) return;
    const txt = buf.join(" ").trim();
    if (txt) out.push(`<p>${txt}</p>`);
    buf.length = 0;
  };

  // collect consecutive list items that match a regex
  const collectList = (start, regex) => {
    const items = [];
    let j = start;
    while (j < lines.length) {
      const m = lines[j].match(regex);
      if (!m) break;
      items.push(m[1].trim());
      j++;
    }
    return { items, next: j };
  };

  // previous non-empty line index
  const prevNonEmptyIndex = (idx) => {
    let k = idx - 1;
    while (k >= 0 && !lines[k].trim()) k--;
    return k;
  };

  // Stricter patterns
  const h3Pattern = /^###\s+(.*)$/;
  // Ordered: number + dot + space, but NOT a decimal like 2.0
  const olPattern = /^\d+\.(?!\d)\s+(.*)$/;
  // Unordered: -, •, – + space
  const ulPattern = /^[-•–]\s+(.*)$/;

  let buf = [];

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw; // keep original spacing for regex

    if (!line.trim()) {
      flushParagraph(buf);
      i++;
      continue;
    }

    // ### Heading
    const h3 = line.match(h3Pattern);
    if (h3) {
      flushParagraph(buf);
      out.push(`<h3>${h3[1]}</h3>`);
      i++;
      continue;
    }

    // Ordered list (require blank line before + ≥ 2 items)
    if (olPattern.test(line)) {
      const prevIdx = prevNonEmptyIndex(i);
      if (prevIdx === -1 || !lines[prevIdx].trim()) {
        const { items, next } = collectList(i, olPattern);
        if (items.length >= 2) {
          flushParagraph(buf);
          out.push(`<ol>${items.map((x) => `<li>${x}</li>`).join("")}</ol>`);
          i = next;
          continue;
        }
      }
      // Not a real list → treat as paragraph text
      buf.push(line.trim());
      i++;
      continue;
    }

    // Unordered list (require blank line before + ≥ 2 items)
    if (ulPattern.test(line)) {
      const prevIdx = prevNonEmptyIndex(i);
      if (prevIdx === -1 || !lines[prevIdx].trim()) {
        const { items, next } = collectList(i, ulPattern);
        if (items.length >= 2) {
          flushParagraph(buf);
          out.push(`<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>`);
          i = next;
          continue;
        }
      }
      // Not a real list → treat as paragraph text
      buf.push(line.trim());
      i++;
      continue;
    }

    // Default: accumulate paragraph text
    buf.push(line.trim());
    i++;
  }

  flushParagraph(buf);
  return out.join("\n");
}

const adSlots = ["1111111111", "2222222222", "3333333333"];

const Content = (props) => {
  const {
    items: { title, intro, sections, additionalSections, image },
  } = props;

  return (
    <>
      <Head>
        <title>{title ? `${title} - Fitness Guide` : "Fitness Guide"}</title>
        <meta
          name="description"
          content={intro || "Learn about fitness techniques and exercises."}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
      </Head>

      <div className={classes["fitness-container"]}>
        <div className={classes["fitness-content"]}>
          <div className={classes.backButtonWrapper}>
            <Link href="/fitness" legacyBehavior>
              <a className={classes.backButton}>← Back to Fitness Guide</a>
            </Link>
          </div>

          {/* Hero image */}
          {image && (
            <div className={classes.topImageWrapper}>
              <Image
                src={`/images/${image}`}
                alt={title || "Wellness Pure Life - Fitness Guide"}
                width={1200}
                height={650}
                priority
              />
            </div>
          )}

          <h1 dangerouslySetInnerHTML={{ __html: formatText(title) }} />
          <div dangerouslySetInnerHTML={{ __html: formatText(intro) }} />

          {sections?.map((section, index) => (
            <div key={index}>
              {section.heading && (
                <h2
                  dangerouslySetInnerHTML={{
                    __html: formatText(section.heading),
                  }}
                />
              )}
              {section.content && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatText(section.content),
                  }}
                />
              )}
              {section.image && (
                <Image
                  src={`/images/${section.image}`}
                  alt={
                    section.heading || "Wellness Pure Life - Fitness Section"
                  }
                  width={700}
                  height={420}
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <FeedbackPrompt />
      <div className={classes["related-posts-wrapper"]}>
        <h3 className={classes["related-posts-title"]}>RELATED POSTS</h3>
        <div className={classes["related-posts-container"]}>
          <FitnessList items={additionalSections} />
        </div>
      </div>
    </>
  );
};

export default Content;
