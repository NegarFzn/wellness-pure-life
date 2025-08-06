import Image from "next/image";
import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import classes from "./content.module.css";
import FitnessList from "./fitness-list";

function formatText(text) {
  if (typeof text !== "string") {
    console.error("Invalid input: text must be a string");
    return "";
  }

  // Bold marked with **
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Bold and color marked with __ for colorful bold text
  text = text.replace(/__(.*?)__/g, '<strong class="colorful">$1</strong>');

  // Increase size marked with --
  text = text.replace(/--(.*?)--/g, '<span class="larger">$1</span>');

  // Decrease size marked with ^^ for smaller text
  text = text.replace(/\^\^(.*?)\^\^/g, '<span class="smaller">$1</span>');

  text = text.replace(/\[\[mind:(\d+)\]\]/g, (_, id) => {
    return `<a href="/mindfulness/${id}" class="internal-link">Explore mindfulness ${id}</a>`;
  });

  text = text.replace(/\[\[nourish:(\d+)\]\]/g, (_, id) => {
    return `<a href="/nourish/${id}" class="internal-link">Explore nutrition ${id}</a>`;
  });

  // Convert newline characters to <br />
  return text.replace(/\n/g, "<br />");
}

const adSlots = ["1111111111", "2222222222", "3333333333"];

const Content = (props) => {
  const {
    items: { title, intro, sections, additionalSections, image },
  } = props;

  return (
    <>
      <Head>
        {/* ✅ SEO Metadata for Better Search Ranking */}
        <title>{title ? `${title} - Fitness Guide` : "Fitness Guide"}</title>
        <meta
          name="description"
          content={intro || "Learn about fitness techniques and exercises."}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />

        {/* ✅ Google AdSense Script (Ensure YOUR_ADSENSE_CLIENT_ID is replaced) */}
      </Head>
     {/*  <AdBlock adSlot="1234567890" className={`${classes.adBlock} ${classes.adTop}`} /> */}
      <div className={classes["fitness-container"]}>
        <div className={classes["fitness-content"]}>
          <div className={classes.backButtonWrapper}>
            <Link href="/fitness" legacyBehavior>
              <a className={classes.backButton}>
                ← Back to Fitness & Exercise Guide
              </a>
            </Link>
          </div>
          <h1 dangerouslySetInnerHTML={{ __html: formatText(title) }}></h1>
          <p dangerouslySetInnerHTML={{ __html: formatText(intro) }}></p>
          <Image
            src={`/images/${image}`}
            alt={title}
            width={700}
            height={500}
            loading="lazy"
          />
          {sections &&
            sections.map((section, index) => (
              <div key={index}>
                {section.heading && (
                  <h2
                    dangerouslySetInnerHTML={{
                      __html: formatText(section.heading),
                    }}
                  ></h2>
                )}
                {section.content && (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: formatText(section.content),
                    }}
                  ></p>
                )}

                {section.image && (
                  <Image
                    src={`/images/${section.image}`}
                    alt={section.heading}
                    width={500}
                    height={300}
                  />
                )}
              </div>
            ))}
        </div>
       {/*  <AdSidebar adSlots={["1234567890", "2345678901", "3456789012"]} /> */}
      </div>
      <div className={classes["related-posts-wrapper"]}>
        <h3 className={classes["related-posts-title"]}>RELATED POSTS</h3>
        <div className={classes["related-posts-container"]}>
          <FitnessList items={additionalSections} />
        </div>
      </div>
      {/* <AdBlock adSlot="2345678901" className={`${classes.adBlock} ${classes.adBottom}`} /> */}
    </>
  );
};

export default Content;
