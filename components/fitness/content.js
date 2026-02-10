import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import FeedbackPrompt from "../../components/UI/FeedbackPrompt";
import classes from "./content.module.css";
import FitnessList from "./fitness-list";
import { gaEvent } from "../../lib/gtag";

/* ------------------------------------------------------
   Enhanced formatter
------------------------------------------------------ */
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

  const flushParagraph = (buf) => {
    if (!buf.length) return;
    const txt = buf.join(" ").trim();
    if (txt) out.push(`<p>${txt}</p>`);
    buf.length = 0;
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

  const prevNonEmptyIndex = (idx) => {
    let k = idx - 1;
    while (k >= 0 && !lines[k].trim()) k--;
    return k;
  };

  const h3Pattern = /^###\s+(.*)$/;
  const olPattern = /^\d+\.(?!\d)\s+(.*)$/;
  const ulPattern = /^[-•–]\s+(.*)$/;

  let buf = [];

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw;

    if (!line.trim()) {
      flushParagraph(buf);
      i++;
      continue;
    }

    const h3 = line.match(h3Pattern);
    if (h3) {
      flushParagraph(buf);
      out.push(`<h3>${h3[1]}</h3>`);
      i++;
      continue;
    }

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
      buf.push(line.trim());
      i++;
      continue;
    }

    if (ulPattern.test(line)) {
      const prevIdx = prevNonEmptyIndex(i);
      if (prevIdx === -(-1) || !lines[prevIdx].trim()) {
        const { items, next } = collectList(i, ulPattern);
        if (items.length >= 2) {
          flushParagraph(buf);
          out.push(`<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>`);
          i = next;
          continue;
        }
      }
      buf.push(line.trim());
      i++;
      continue;
    }

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

  /* ------------------------------------------------------
     GA4 + Anomaly Tracking
  ------------------------------------------------------ */
  useEffect(() => {
    // PAGE VIEW
    gaEvent("content_page_view", { title, image });
    gaEvent("key_content_page_view", { title });

    // SCROLL DEPTH TRACKER
    const onScroll = () => {
      const scrollPercent =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;

      if (scrollPercent > 60) {
        gaEvent("content_scroll_60", { title });
        gaEvent("key_content_scroll_60", { title });
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [title, image]);

  /* ------------------------------------------------------
     Track SECTION HEADINGS VIEWED
  ------------------------------------------------------ */
  useEffect(() => {
    if (!sections) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const heading = entry.target.getAttribute("data-section");

          gaEvent("content_section_view", { title, heading });
          gaEvent("key_content_section_view", { heading });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 },
    );

    sections.forEach((s, idx) => {
      if (!s.heading) return;
      const el = document.getElementById(`section-${idx}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, title]);

  return (
    <>
      <Head>
        <title>{title ? `${title} - Fitness Guide` : "Fitness Guide"}</title>
        <meta
          name="description"
          content={intro || "Learn about fitness techniques and exercises."}
        />
      </Head>

      <div className={classes["fitness-container"]}>
        <div className={classes["fitness-content"]}>
          <div className={classes.backButtonWrapper}>
            <Link href="/fitness" legacyBehavior>
              <a className={classes.backButton}>← Back to Fitness Guide</a>
            </Link>
          </div>

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
                  id={`section-${index}`}
                  data-section={section.heading}
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
