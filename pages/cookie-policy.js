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
        <p className={classes.updatedDate}>Last updated: March 07, 2025</p>

        <p className={classes.text}>
          Welcome to <strong>WellnessPureLife</strong>. This Cookie Policy
          explains how we use cookies and similar tracking technologies on our
          website. By using our website, you consent to our use of cookies in
          accordance with this policy.
        </p>

        <h2 className={classes.sectionTitle}>1. What Are Cookies?</h2>
        <p className={classes.text}>
          Cookies are small text files stored on your device (computer, tablet,
          smartphone) when you visit a website. They help improve user
          experience, enable certain functionalities, and provide insights into
          how visitors interact with the website.
        </p>

        <h2 className={classes.sectionTitle}>2. How We Use Cookies</h2>
        <ul className={classes.list}>
          <li>
            <strong>Essential Cookies:</strong> Required for core website
            functionality.
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Track website performance and
            visitor behavior.
          </li>
          <li>
            <strong>Advertising Cookies:</strong> Deliver personalized ads based
            on browsing history.
          </li>
          <li>
            <strong>Functional Cookies:</strong> Remember preferences (e.g.,
            language settings).
          </li>
        </ul>

        <h2 className={classes.sectionTitle}>3. Managing Cookies</h2>
        <p className={classes.text}>
          You can control or delete cookies through your browser settings:
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

        <h2 className={classes.sectionTitle}>4. Contact Us</h2>
        <p className={classes.text}>
          If you have any questions about our Cookie Policy, please contact us:
        </p>
        <ul className={classes.list}>
          <li>
            Email:{" "}
            <a href="mailto:info@wellnesspurelife.com" className={classes.link}>
              info@wellnesspurelife.com
            </a>
          </li>
          <li>
            Website:{" "}
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
