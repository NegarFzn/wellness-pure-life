import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import classes from "./content.module.css";
import NourishList from "./nourish-list";

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

        {/* ✅ Google AdSense Script (Replace with Your Client ID) */}
      </Head>
      <script
        async
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_ADSENSE_CLIENT_ID"
        crossOrigin="anonymous"
      ></script>
      <div className={classes["ad-top"]}>{/* Ad at the top */}</div>
      <div className={classes["nourish-container"]}>
        <div className={classes["nourish-content"]}>
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
      <h3 className={classes.h3Class}>RELATED POSTS</h3>
      <NourishList items={additionalSections} />
      <div className={classes["ad-bottom"]}>{/* Ad at the bottom */}</div>
    </>
  );
};

export default Content;
