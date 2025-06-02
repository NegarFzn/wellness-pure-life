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
        <p className={classes.updatedDate}>Last updated: June 2, 2025</p>

        <p className={classes.text}>
          Welcome to <strong>WellnessPureLife</strong>. Your privacy is
          important to us. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you visit our website or
          use our services, including our handling of cookies, ads, and
          analytics based on your consent preferences.
        </p>

        <h2 className={classes.sectionTitle}>1. Information We Collect</h2>
        <p className={classes.text}>
          We may collect and process the following types of information:
        </p>
        <ul className={classes.list}>
          <li>
            <strong>Personal Information:</strong> Name, email address, phone
            number, and billing details.
          </li>
          <li>
            <strong>Usage Data:</strong> IP address, browser type, pages
            visited, time spent on pages.
          </li>
          <li>
            <strong>Cookies & Tracking:</strong> Includes cookies for site
            functionality, analytics, and ads. See our{" "}
            <a href="/cookie-policy" className={classes.link}>
              Cookie Policy
            </a>{" "}
            for full details.
          </li>
        </ul>

        <h2 className={classes.sectionTitle}>2. How We Use Your Information</h2>
        <p className={classes.text}>We use the data we collect to:</p>
        <ul className={classes.list}>
          <li>Operate and improve our website and services.</li>
          <li>Provide support and respond to inquiries.</li>
          <li>Analyze usage trends to enhance the user experience.</li>
          <li>Comply with legal obligations and prevent fraud.</li>
        </ul>

        <h2 className={classes.sectionTitle}>3. Third-Party Sharing</h2>
        <p className={classes.text}>
          We do not sell your personal data. We may share limited information
          with:
        </p>
        <ul className={classes.list}>
          <li>Trusted service providers (e.g., cloud hosting, analytics).</li>
          <li>Law enforcement or regulators when legally required.</li>
          <li>
            Advertising partners (e.g., Google) for delivering personalized or
            non-personalized ads, depending on your cookie consent.
          </li>
        </ul>

        <h2 className={classes.sectionTitle}>4. Data Security</h2>
        <p className={classes.text}>
          We use industry-standard encryption and secure systems to protect your
          information. Despite our efforts, no online transmission is 100%
          secure.
        </p>

        <h2 className={classes.sectionTitle}>5. Your Rights</h2>
        <p className={classes.text}>You have the right to:</p>
        <ul className={classes.list}>
          <li>Access, correct, or delete your personal data.</li>
          <li>Withdraw consent for marketing communications.</li>
          <li>Request a copy of the information we store.</li>
          <li>
            Control cookie use via the banner or settings link in the footer.
          </li>
        </ul>

        <h2 className={classes.sectionTitle}>6. Changes to This Policy</h2>
        <p className={classes.text}>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page and reflected in the “Last updated” date.
        </p>

        <h2 className={classes.sectionTitle}>7. Contact Us</h2>
        <p className={classes.text}>
          If you have questions or concerns about this policy or your data:
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

export default PrivacyPolicy;
