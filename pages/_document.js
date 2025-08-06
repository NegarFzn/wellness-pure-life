// pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* ✅ Google AdSense Script */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6324625824043093"
            crossOrigin="anonymous"
          ></script>

          {/* ✅ SEO Meta Tags */}
          <meta name="robots" content="index, follow" />
          <meta
            name="description"
            content="Wellness Pure Life offers expert advice on fitness, mindfulness, and nutrition to help you live a healthier life."
          />
          <meta
            name="keywords"
            content="wellness, fitness, mindfulness, nutrition, healthy living"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          {/* Optional: favicon or other link tags can go here */}
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
