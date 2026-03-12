import Head from "next/head";
import classes from "./terms.module.css";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service | Wellness Pure Life</title>
        <meta
          name="description"
          content="Read the Terms of Service for Wellness Pure Life. Learn about the rules and guidelines for using our wellness tools, plans, and resources."
        />
      </Head>

      <div className={classes.termsContainer}>
        <div className={classes.termsWrapper}>
          
          <h1 className={classes.termsTitle}>Terms of Service</h1>
          <p className={classes.termsUpdated}>Last updated: 2026</p>

          <section className={classes.termsSection}>
            <h2>1. Introduction</h2>
            <p>
              Welcome to <strong>Wellness Pure Life</strong>. These Terms of
              Service govern your use of our website, tools, and wellness
              resources. By accessing or using our platform, you agree to comply
              with these terms.
            </p>
          </section>

          <section className={classes.termsSection}>
            <h2>2. Use of the Website</h2>
            <p>
              Wellness Pure Life provides informational content, wellness tools,
              and personalized resources designed to support healthy living.
              Users agree to use the website responsibly and only for lawful
              purposes.
            </p>
          </section>

          <section className={classes.termsSection}>
            <h2>3. Wellness Disclaimer</h2>
            <p>
              The content on this website is provided for informational purposes
              only and should not be considered medical or professional advice.
              Always consult a qualified professional before making health or
              lifestyle changes.
            </p>
          </section>

          <section className={classes.termsSection}>
            <h2>4. User Responsibilities</h2>
            <ul>
              <li>Use the platform in compliance with applicable laws.</li>
              <li>Do not misuse or attempt to disrupt the website.</li>
              <li>Respect intellectual property and platform content.</li>
            </ul>
          </section>

          <section className={classes.termsSection}>
            <h2>5. Intellectual Property</h2>
            <p>
              All content on Wellness Pure Life, including text, design,
              graphics, and software, is the property of Wellness Pure Life or
              its licensors and is protected by copyright and intellectual
              property laws.
            </p>
          </section>

          <section className={classes.termsSection}>
            <h2>6. Limitation of Liability</h2>
            <p>
              Wellness Pure Life is not liable for any damages arising from the
              use or inability to use the website or its content.
            </p>
          </section>

          <section className={classes.termsSection}>
            <h2>7. Changes to These Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Continued
              use of the website after changes indicates acceptance of the
              revised terms.
            </p>
          </section>

          <section className={classes.termsSection}>
            <h2>8. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at:
              <br />
              <strong>info@wellnesspurelife.com</strong>
            </p>
          </section>

        </div>
      </div>
    </>
  );
}