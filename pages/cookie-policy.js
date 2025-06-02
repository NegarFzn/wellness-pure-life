import Head from "next/head";
import classes from "./CookiePolicy.module.css";

const CookiePolicy = () => {
  return (
    <>
      <Head>
        <title>Cookie Policy | WellnessPureLife</title>
        <meta name="description" content="Cookie Policy of WellnessPureLife" />
      </Head>
      <main className={classes.container}>
        <h1 className={classes.heading}>Cookie Policy</h1>
        <p className={classes.updatedDate}>Last updated: June 2, 2025</p>

        <p className={classes.text}>
          Welcome to <strong>WellnessPureLife</strong>. This Cookie Policy
          explains how we use cookies and similar tracking technologies on our
          website. By using our website, you consent to our use of cookies in
          accordance with this policy — based on your preferences.
        </p>

        <h2 className={classes.sectionTitle}>1. What Are Cookies?</h2>
        <p className={classes.text}>
          Cookies are small text files stored on your device when you visit a
          website. They help improve your experience, remember preferences, and
          provide insight into how users interact with the site.
        </p>

        <h2 className={classes.sectionTitle}>2. Types of Cookies We Use</h2>
        <ul className={classes.list}>
          <li>
            <strong>Essential Cookies:</strong> Required for basic functionality
            and security (e.g., login sessions).
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Help us understand user behavior
            to improve our content and performance.
          </li>
          <li>
            <strong>Advertising Cookies:</strong> Used by Google and partners to
            deliver personalized or non-personalized ads based on consent.
          </li>
          <li>
            <strong>Functional Cookies:</strong> Remember choices such as
            language preferences.
          </li>
        </ul>

        <h2 className={classes.sectionTitle}>3. Consent and Cookie Choices</h2>
        <p className={classes.text}>
          Upon visiting our site, you are presented with a cookie banner where
          you can:
        </p>
        <ul className={classes.list}>
          <li>
            <strong>Accept All:</strong> Allow all cookies including analytics
            and personalized advertising.
          </li>
          <li>
            <strong>Use Essential Only:</strong> Only allow cookies necessary
            for site functionality. Google ads will be served as
            non-personalized.
          </li>
        </ul>
        <p className={classes.text}>
          You may update your preferences at any time by clearing your browser’s
          local storage or visiting the cookie settings link in our website
          footer.
        </p>

        <h2 className={classes.sectionTitle}>4. Managing Cookies</h2>
        <p className={classes.text}>
          You can control cookies manually through your browser settings:
        </p>
        <ul className={classes.list}>
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
            >
              Manage Cookies in Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
            >
              Manage Cookies in Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/en-us/HT201265"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
            >
              Manage Cookies in Safari
            </a>
          </li>
        </ul>

        <h2 className={classes.sectionTitle}>5. Contact Us</h2>
        <p className={classes.text}>
          If you have any questions or concerns about our cookie practices:
        </p>
        <ul className={classes.list}>
          <li>
            Email:{" "}
            <a href="mailto:info@wellnesspurelife.com" className={classes.link}>
              info@wellnesspurelife.com
            </a>
          </li>
          <li>
            Contact Form:{" "}
            <a
              href="https://www.wellnesspurelife.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
            >
              www.wellnesspurelife.com/contact
            </a>
          </li>
        </ul>
      </main>
    </>
  );
};

export default CookiePolicy;
