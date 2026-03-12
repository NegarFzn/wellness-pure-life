import Head from "next/head";
import classes from "./about.module.css";

export default function About() {
  return (
    <>
      <Head>
        <title>About | Wellness Pure Life</title>
        <meta
          name="description"
          content="Learn about Wellness Pure Life — a platform dedicated to fitness, mindfulness, and balanced living."
        />
      </Head>

      <section className={classes.aboutHero}>
        <div className={classes.aboutHeroInner}>
          <h1 className={classes.aboutTitle}>Wellness Pure Life</h1>
          <p className={classes.aboutSubtitle}>
            Supporting healthier and more balanced lives through fitness,
            mindfulness, and nutrition.
          </p>
        </div>
      </section>

      <main className={classes.aboutContainer}>
        <section className={classes.aboutSection}>
          <h2 className={classes.sectionTitle}>Our Vision</h2>
          <p className={classes.sectionText}>
            Wellness Pure Life was created to help people build healthier habits
            and sustainable routines that improve overall well-being.
          </p>
        </section>

        <section className={classes.aboutSection}>
          <h2 className={classes.sectionTitle}>What We Offer</h2>

          <div className={classes.aboutGrid}>
            <div className={classes.aboutCard}>
              <h3 className={classes.cardTitle}>
                <a href="/fitness" className={classes.cardLink}>
                  Fitness
                </a>
              </h3>
              <p className={classes.cardText}>
                Structured workout routines designed to improve strength and
                overall health.
              </p>
            </div>

            <div className={classes.aboutCard}>
              <h3 className={classes.cardTitle}>
                <a href="/mindfulness" className={classes.cardLink}>
                  Mindfulness
                </a>
              </h3>
              <p className={classes.cardText}>
                Mental wellness practices that support focus, calmness, and
                emotional balance.
              </p>
            </div>

            <div className={classes.aboutCard}>
              <h3 className={classes.cardTitle}>
                <a href="/nourish" className={classes.cardLink}>
                  Nutrition
                </a>
              </h3>
              <p className={classes.cardText}>
                Practical nutrition guidance to help maintain healthy daily
                habits.
              </p>
            </div>

            <div className={classes.aboutCard}>
              <h3 className={classes.cardTitle}>
                <a href="/sample/weekly-plan" className={classes.cardLink}>
                  Personalized Plans
                </a>
              </h3>
              <p className={classes.cardText}>
                Interactive quizzes and personalized wellness plans based on
                individual goals.
              </p>
            </div>
          </div>
        </section>

        <section className={classes.aboutSection}>
          <h2 className={classes.sectionTitle}>Our Mission</h2>
          <p className={classes.sectionText}>
            Our mission is to make wellness accessible by helping individuals
            integrate healthier habits into their everyday lives.
          </p>
        </section>

        <section className={classes.aboutSection}>
          <h2 className={classes.sectionTitle}>Disclaimer</h2>
          <p className={classes.sectionText}>
            The information on this website is provided for educational and
            informational purposes only and should not be considered medical
            advice. Always consult qualified healthcare professionals before
            making health-related decisions.
          </p>
        </section>

        <section className={classes.aboutSection}>
          <h2 className={classes.sectionTitle}>Contact</h2>
          <p className={classes.sectionText}>
            If you have questions or feedback, please visit our{" "}
            <a href="/contact" className={classes.contactLink}>
              contact page
            </a>
            .
          </p>
        </section>
      </main>
    </>
  );
}
