import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { gaEvent } from "../../lib/gtag";
import FeedbackPrompt from "../../components/UI/FeedbackPrompt";
import classes from "./content.module.css";
import NourishList from "./nourish-list";

function formatText(text) {
  if (typeof text !== "string") return "";

  let t = text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, '<strong class="colorful">$1</strong>')
    .replace(/--(.+?)--/g, '<span class="larger">$1</span>')
    .replace(/\^\^(.+?)\^\^/g, '<span class="smaller">$1</span>');

  t = t.replace(/\[\[mind:(\d+)\]\]/g, (_, id) => {
    return `<a href="/mindfulness/${id}" class="internal-link">Explore mindfulness ${id}</a>`;
  });
  t = t.replace(/\[\[nourish:(\d+)\]\]/g, (_, id) => {
    return `<a href="/nourish/${id}" class="internal-link">Explore nutrition ${id}</a>`;
  });

  const lines = t.split(/\r?\n/);
  const out = [];
  let i = 0;
  let buf = [];

  const flushParagraph = (ref) => {
    if (!ref.length) return;
    const txt = ref.join(" ").trim();
    if (txt) out.push(`<p>${txt}</p>`);
    ref.length = 0;
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

    const h3 = line.match(/^###\s+(.*)$/);
    if (h3) {
      flushParagraph(buf);
      out.push(`<h3>${h3[1]}</h3>`);
      i++;
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph(buf);
      const { items, next } = collectList(i, /^\d+\.\s+(.*)$/);
      out.push(`<ol>${items.map((x) => `<li>${x}</li>`).join("")}</ol>`);
      i = next;
      continue;
    }

    if (/^[-•–]\s+/.test(line)) {
      flushParagraph(buf);
      const { items, next } = collectList(i, /^[-•–]\s+(.*)$/);
      out.push(`<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>`);
      i = next;
      continue;
    }

    buf.push(line.trim());
    i++;
  }

  flushParagraph(buf);
  return out.join("\n");
}

const Content = (props) => {
  const {
    items: { title, intro, sections, additionalSections, image },
  } = props;

  // PAGE VIEW analytics
  if (title) {
    gaEvent("nourish_article_view", { title });
    gaEvent("key_nourish_article_view", { title });
  }

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
      </Head>

      <div className={classes["nourish-container"]}>
        <div className={classes["nourish-content"]}>
          <div className={classes.backButtonWrapper}>
            <Link href="/nourish" legacyBehavior>
              <a
                className={classes.backButton}
                onClick={() => {
                  gaEvent("nourish_back_click", { from: title });
                  gaEvent("key_nourish_back_click", { from: title });
                }}
              >
                ← Back to Nourish Guide
              </a>
            </Link>
          </div>

          {image && (
            <div className={classes.topImageWrapper}>
              <Image
                src={`/images/${image}`}
                alt={title || "Nourish Hero"}
                width={1200}
                height={650}
                priority
                onLoad={() => {
                  gaEvent("nourish_hero_image_view", { title });
                  gaEvent("key_nourish_hero_image_view", { title });
                }}
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
                  onMouseEnter={() => {
                    gaEvent("nourish_section_heading_view", {
                      heading: section.heading,
                      index,
                    });
                    gaEvent("key_nourish_section_heading_view", {
                      heading: section.heading,
                      index,
                    });
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
                  alt={section.heading || "Nourish Section Image"}
                  width={700}
                  height={420}
                  loading="lazy"
                  onLoad={() => {
                    gaEvent("nourish_section_image_view", {
                      image: section.image,
                      index,
                    });
                    gaEvent("key_nourish_section_image_view", {
                      image: section.image,
                      index,
                    });
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <FeedbackPrompt />

      <div
        className={classes["related-posts-wrapper"]}
        onMouseEnter={() => {
          gaEvent("nourish_related_posts_view", { title });
          gaEvent("key_nourish_related_posts_view", { title });
        }}
      >
        <h3 className={classes["related-posts-title"]}>RELATED POSTS</h3>
        <div className={classes["related-posts-container"]}>
          <NourishList items={additionalSections} />
        </div>
      </div>
    </>
  );
};

export default Content;
