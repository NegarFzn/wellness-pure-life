import FAQItem from "../components/FAQItem/FAQItem";
import Head from "next/head";
import { useEffect } from "react";
import { gaEvent } from "../lib/gtag";

const FAQPage = () => {
  const adStyle = {
    display: "block",
    margin: "2rem 0",
    textAlign: "center",
    minHeight: "100px",
  };

  const wrapperStyle = {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "1rem",
  };

  useEffect(() => {
    // PAGE VIEW (normal + anomaly)
    gaEvent("faq_page_view");
    gaEvent("key_faq_page_view");

    // FAQ SECTION VISIBLE
    gaEvent("faq_section_view");
    gaEvent("key_faq_section_view");
  }, []);

  return (
    <>
      <Head>
        <title>FAQ – Wellness Pure Life</title>
        <meta
          name="description"
          content="Find answers to common questions about Wellness Pure Life. Learn how to get started, upgrade to premium, and use our AI Wellness Assistant."
        />

        {/* OG / Twitter */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wellness Pure Life" />
        <meta property="og:title" content="FAQ – Wellness Pure Life" />
        <meta
          property="og:description"
          content="Find answers to common questions about Wellness Pure Life."
        />
        <meta
          property="og:image"
          content="https://wellnesspurelife.com/images/social-card.jpg"
        />
        <meta property="og:url" content="https://wellnesspurelife.com/faq" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ – Wellness Pure Life" />
        <meta
          name="twitter:description"
          content="Find answers to common questions about WPL."
        />
        <meta
          name="twitter:image"
          content="https://wellnesspurelife.com/images/social-card.jpg"
        />

        <link rel="canonical" href="https://wellnesspurelife.com/faq" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={wrapperStyle}>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            marginBottom: "2rem",
          }}
        >
          Frequently Asked Questions
        </h2>

        <FAQItem
          question="How do I create an account?"
          answer="Click on the Sign Up button at the top-right corner and enter your email and password."
        />
        <FAQItem
          question="What features are included in Premium?"
          answer="Premium includes guided meditations, personalized meal plans, and access to the AI Wellness Assistant."
        />
        <FAQItem
          question="How do I use the AI Wellness Assistant?"
          answer="Once you're a premium user, open the assistant from the bottom corner chat launcher and start asking questions."
        />
        <FAQItem
          question="Is my data safe?"
          answer="Yes, we follow industry standards to protect your information."
        />
      </div>
    </>
  );
};

export default FAQPage;
