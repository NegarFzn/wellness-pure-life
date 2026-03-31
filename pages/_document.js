// pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* ======================== */}
          {/* ✅ Google AdSense */}
          {/* ======================== */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6324625824043093"
            crossOrigin="anonymous"
          ></script>
          {/* ======================== */}
          {/* ✅ SEO Meta Tags */}
          {/* ======================== */}
          <meta name="robots" content="index, follow" />
          <meta
            name="description"
            content="Wellness Pure Life offers expert advice on fitness, mindfulness, and nutrition to help you live a healthier life."
          />
          <meta
            name="keywords"
            content="wellness, fitness, mindfulness, nutrition, healthy living"
          />
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          {/* ======================== */}
          {/* ✅ Open Graph */}
          {/* ======================== */}
          <meta
            property="og:title"
            content="Wellness Pure Life – Personalized Wellness Plans"
          />
          <meta
            property="og:description"
            content="Create your custom fitness, nutrition, and mindfulness plans based on your goals."
          />
          <meta
            property="og:image"
            content="https://wellnesspurelife.com/og-image.jpg"
          />
          <meta property="og:url" content="https://wellnesspurelife.com" />
          <meta property="og:type" content="website" />

          {/* ======================== */}
          {/* ✅ Twitter Card */}
          {/* ======================== */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Wellness Pure Life – Personalized Plans"
          />
          <meta
            name="twitter:description"
            content="Custom wellness programs based on your preferences and goals."
          />
          <meta
            name="twitter:image"
            content="https://wellnesspurelife.com/og-image.jpg"
          />

          {/* Optional: favicon */}
          {/* <link rel="icon" href="/favicon.ico" /> */}
        </Head>
        <body>
          <div id="overlays" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
