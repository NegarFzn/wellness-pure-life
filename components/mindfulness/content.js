import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import classes from "./content.module.css";
import MindfulnessList from "./mindfulness-list";

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

  // Convert newline characters to <br />
  return text.replace(/\n/g, "<br />");
}

const Content = (props) => {
  const {
    items: { title, intro, sections, additionalSections, image },
  } = props;

  return (
    <>
      <Head>
        {/* ✅ SEO Metadata for Better Search Ranking */}
        <title>
          {title ? `${title} - Mindfulness Guide` : "Mindfulness Guide"}
        </title>
        <meta
          name="description"
          content={intro || "Learn about mindfulness techniques and exercises."}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />

        {/* ✅ Google AdSense Script (Ensure YOUR_ADSENSE_CLIENT_ID is replaced) */}
      </Head>
      <script
        async
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_ADSENSE_CLIENT_ID"
        crossOrigin="anonymous"
      ></script>

      <div className={classes["ad-top"]}>{/* Ad at the top */}</div>
      <div className={classes["mindfulness-container"]}>
        <div className={classes["mindfulness-content"]}>
          <div className={classes.backButtonWrapper}>
            <Link href="/mindfulness" legacyBehavior>
              <a className={classes.backButton}>← Back to Mindfulness Guide</a>
            </Link>
          </div>
          <h1 dangerouslySetInnerHTML={{ __html: formatText(title) }}></h1>
          <p dangerouslySetInnerHTML={{ __html: formatText(intro) }}></p>
          <Image
            src={`/images/${image}`}
            alt={title}
            width={700}
            height={500}
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
        <div className={classes["ad-sidebar"]}>
          <Script
            async
            strategy="afterInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_ADSENSE_CLIENT_ID"
            crossOrigin="anonymous"
          />
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="YOUR_ADSENSE_CLIENT_ID"
            data-ad-slot="XXXXXXX"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      </div>
      <div className={classes["related-posts-wrapper"]}>
        <h3 className={classes["related-posts-title"]}>RELATED POSTS</h3>
        <div className={classes["related-posts-container"]}>
          <MindfulnessList items={additionalSections} />
        </div>
      </div>
      <div className={classes["ad-bottom"]}>{/* Ad at the bottom */}</div>
    </>
  );
};

export default Content;
