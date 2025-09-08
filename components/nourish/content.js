import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import FeedbackPrompt from "../../components/UI/FeedbackPrompt";
import classes from "./content.module.css";
import NourishList from "./nourish-list";

// Enhanced formatter (parity with the attached file)
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

  // Block parsing (headings, lists, paragraphs)
  const lines = t.split(/\r?\n/);
  const out = [];
  let i = 0;
  let buf = [];

  const flushParagraph = (bufRef) => {
    if (!bufRef.length) return;
    const txt = bufRef.join(" ").trim();
    if (txt) out.push(`<p>${txt}</p>`);
    bufRef.length = 0;
  };

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

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      flushParagraph(buf);
      i++;
      continue;
    }

    // ### Heading
    const h3 = line.match(/^###\s+(.*)$/);
    if (h3) {
      flushParagraph(buf);
      out.push(`<h3>${h3[1]}</h3>`);
      i++;
      continue;
    }

    // Ordered list (1. item)
    if (/^\d+\.\s+/.test(line)) {
      flushParagraph(buf);
      const { items, next } = collectList(i, /^\d+\.\s+(.*)$/);
      out.push(`<ol>${items.map((x) => `<li>${x}</li>`).join("")}</ol>`);
      i = next;
      continue;
    }

    // Unordered list (-, •, –)
    if (/^[-•–]\s+/.test(line)) {
      flushParagraph(buf);
      const { items, next } = collectList(i, /^[-•–]\s+(.*)$/);
      out.push(`<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>`);
      i = next;
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
        <title>{title ? `${title} - Nourish Guide` : "Nourish Guide"}</title>
        <meta
          name="description"
          content={
            intro ||
            "Discover nutrition insights, healthy eating tips, and nourishing recipes to enhance your well-being."
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        {/* ✅ Google AdSense Script (Replace with your client ID) */}
      </Head>

      {/* <AdBlock adSlot="1234567890" className={`${classes.adBlock} ${classes.adTop}`} /> */}

      <div className={classes["nourish-container"]}>
        <div className={classes["nourish-content"]}>
          <div className={classes.backButtonWrapper}>
            <Link href="/nourish" legacyBehavior>
              <a className={classes.backButton}>← Back to Nourish Guide</a>
            </Link>
          </div>

          {/* ✅ Top hero image (matches attached file behavior) */}
          {image && (
            <div className={classes.topImageWrapper}>
              <Image
                src={`/images/${image}`}
                alt={title}
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
                  alt={section.heading}
                  width={700}
                  height={420}
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
        {/* <AdSidebar adSlots={["1234567890", "2345678901", "3456789012"]} /> */}
      </div>
      <FeedbackPrompt />
      <div className={classes["related-posts-wrapper"]}>
        <h3 className={classes["related-posts-title"]}>RELATED POSTS</h3>
        <div className={classes["related-posts-container"]}>
          <NourishList items={additionalSections} />
        </div>
      </div>

      {/* <AdBlock adSlot="2345678901" className={`${classes.adBlock} ${classes.adBottom}`} /> */}
    </>
  );
};

export default Content;
