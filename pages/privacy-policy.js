import Head from "next/head";
import classes from "./PrivacyPolicy.module.css";

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | WellnessPureLife</title>
        <meta name="description" content="Privacy Policy of WellnessPureLife" />
      </Head>
      <main className={classes.container}>
        <h1 className={classes.heading}>Privacy Policy</h1>
        <p className={classes.updatedDate}>Last updated: March 07, 2025</p>

        <p className={classes.text}>
          Welcome to <strong>WellnessPureLife</strong>. Your privacy is
          important to us. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you visit our website or
          use our services.
        </p>

        <h2 className={classes.sectionTitle}>1. Information We Collect</h2>
        <p className={classes.text}>
          We may collect and process the following data:
        </p>
        <ul className={classes.list}>
          <li>
            <strong>Personal Information:</strong> Name, email address, phone
            number, billing details.
          </li>
          <li>
            <strong>Usage Data:</strong> IP address, browser type, pages
            visited, time spent on pages.
          </li>
          <li>
            <strong>Cookies & Tracking:</strong> See our{" "}
            <a href="/cookie-policy" className={classes.link}>
              Cookie Policy
            </a>{" "}
            for details.
          </li>
        </ul>

        <h2 className={classes.sectionTitle}>2. How We Use Your Information</h2>
        <p className={classes.text}>We use the collected data to:</p>
        <ul className={classes.list}>
          <li>Improve our services and user experience.</li>
          <li>Provide customer support and respond to inquiries.</li>
          <li>Monitor website performance and analytics.</li>
          <li>Comply with legal and regulatory requirements.</li>
        </ul>

        <h2 className={classes.sectionTitle}>3. Third-Party Sharing</h2>
        <p className={classes.text}>
          We do not sell or trade your personal information. However, we may
          share data with:
        </p>
        <ul className={classes.list}>
          <li>
            Service providers that assist in operations (e.g., hosting,
            analytics).
          </li>
          <li>Legal authorities, if required by law.</li>
          <li>
            Advertising partners for Google Ads and personalized experiences.
          </li>
        </ul>

        <h2 className={classes.sectionTitle}>4. Data Security</h2>
        <p className={classes.text}>
          We take security seriously. We implement industry-standard encryption
          and access controls to protect your data. However, no online
          transmission is 100% secure.
        </p>

        <h2 className={classes.sectionTitle}>5. Your Rights</h2>
        <p className={classes.text}>You have the right to:</p>
        <ul className={classes.list}>
          <li>Access, update, or delete your personal information.</li>
          <li>Opt-out of email communications.</li>
          <li>Request a copy of the data we store.</li>
        </ul>

        <h2 className={classes.sectionTitle}>
          6. Changes to This Privacy Policy
        </h2>
        <p className={classes.text}>
          We may update this policy periodically. Any changes will be posted on
          this page with the updated date.
        </p>

        <h2 className={classes.sectionTitle}>7. Contact Us</h2>
        <p className={classes.text}>
          If you have any questions about this Privacy Policy, you can contact
          us:
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

export default PrivacyPolicy;
