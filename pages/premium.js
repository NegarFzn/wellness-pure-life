import Head from "next/head";
import Link from "next/link";
import classes from "./premium.module.css";

export default function PremiumPage() {
  return (
    <>
      <Head>
        <title>Wellness Pure Life Pro | Premium Membership</title>
        <meta
          name="description"
          content="Unlock your personalized wellness system with Premium: weekly plans, rituals, workouts, sleep programs, nutrition, and your AI wellness coach."
        />
      </Head>

      <main className={classes.page}>
        {/* HERO */}
        <section className={classes.hero}>
          <div className={classes.heroBg} />

          <p className={classes.eyebrow}>Premium Membership</p>

          <h1 className={classes.title}>
            Wellness Pure Life <span>Pro</span>
          </h1>

          <p className={classes.subtitle}>
            A vibrant, structured, science-based system to boost your energy,
            improve your mood, strengthen your body, and help you live with
            clarity and confidence.
          </p>

          <ul className={classes.heroList}>
            <li>Weekly personalized plan</li>
            <li>Premium workouts & rituals</li>
            <li>AI wellness coach</li>
            <li>Sleep & stress reset</li>
            <li>Nutrition structure</li>
          </ul>

          <div className={classes.heroActions}>
            <Link href="#pricing" className={classes.primaryButton}>
              Become a Premium Member
            </Link>
            <Link href="/quizzes/quiz-main" className={classes.secondaryButton}>
              Start With Free Quiz
            </Link>
          </div>
        </section>

        {/* FEATURES */}
        <section className={classes.section}>
          <header className={classes.sectionHeader}>
            <h2 className={classes.sectionTitle}>What’s Inside Premium</h2>
            <p className={classes.sectionSubtitle}>
              A complete, colorful wellness system designed to support your mind
              and body every day.
            </p>
          </header>

          <div className={classes.featureGrid}>
            {[
              {
                title: "Personalized Weekly Wellness Plan",
                desc: "A weekly plan based on your quiz answers — movement, rituals, recovery, and focus tasks.",
              },
              {
                title: "Daily Rituals Pro",
                desc: "Advanced morning, evening, breathing, focus and stress rituals that fit real life.",
              },
              {
                title: "Premium Workouts",
                desc: "Strength, mobility, low-impact, fat-burning routines with colorful illustrations.",
              },
              {
                title: "AI Wellness Coach",
                desc: "Ask about routines, sleep, stress, habits, nutrition — get tailored guidance instantly.",
              },
              {
                title: "Sleep Reset Program",
                desc: "A calming 7-day system for deep, restorative sleep and more stable energy.",
              },
              {
                title: "Stress Calm Protocol",
                desc: "Somatic techniques + breathing sequences + rapid tension release methods.",
              },
              {
                title: "Easy Nutrition Structure",
                desc: "Simple meals, weekly guidance, smart snack ideas, hydration plan.",
              },
              {
                title: "Habit & Progress Tracking",
                desc: "Track sleep, movement, hydration, rituals — build consistency effortlessly.",
              },
              {
                title: "Premium Articles",
                desc: "Deep, structured wellness education that helps you understand your mind & body.",
              },
            ].map((f, i) => (
              <div key={i} className={classes.featureCard}>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COMPARISON */}
        <section className={classes.section}>
          <header className={classes.sectionHeader}>
            <h2 className={classes.sectionTitle}>Free vs Premium</h2>
            <p className={classes.sectionSubtitle}>
              Upgrade to unlock your full personalized wellness experience.
            </p>
          </header>

          <div className={classes.tableWrap}>
            <table className={classes.compare}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Free</th>
                  <th className={classes.premiumCol}>Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Blog articles", "✔", "✔"],
                  ["Basic workouts", "✔", "✔"],
                  ["Standard rituals", "✔", "✔"],
                  ["Weekly personalized plan", "✖", "✔"],
                  ["Daily Rituals Pro", "✖", "✔"],
                  ["Premium workouts", "✖", "✔"],
                  ["Sleep reset program", "✖", "✔"],
                  ["Stress calm program", "✖", "✔"],
                  ["Easy nutrition guide", "✖", "✔"],
                  ["AI wellness coach", "✖", "✔"],
                  ["Premium articles", "✖", "✔"],
                ].map(([feat, free, prem], i) => (
                  <tr key={i}>
                    <td>{feat}</td>
                    <td>{free}</td>
                    <td className={classes.premiumCol}>{prem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className={classes.section}>
          <header className={classes.sectionHeader}>
            <h2 className={classes.sectionTitle}>Choose Your Plan</h2>
            <p className={classes.sectionSubtitle}>
              Full access to the entire premium system. Cancel anytime.
            </p>
          </header>

          <div className={classes.pricingGrid}>
            <div className={classes.priceCard}>
              <p className={classes.planTitle}>Monthly</p>
              <p className={classes.price}>
                $9.99 <span>/month</span>
              </p>
              <ul className={classes.planList}>
                <li>Full premium access</li>
                <li>Cancel anytime</li>
                <li>Perfect for trying it out</li>
              </ul>
              <Link
                href="/checkout?plan=monthly"
                className={classes.primaryButton}
              >
                Start Monthly
              </Link>
            </div>

            <div className={`${classes.priceCard} ${classes.popularCard}`}>
              <div className={classes.badge}>Most Popular</div>
              <p className={classes.planTitle}>Yearly</p>
              <p className={classes.price}>
                $79 <span>/year</span>
              </p>
              <ul className={classes.planList}>
                <li>Save 34% yearly</li>
                <li>Full premium access</li>
                <li>Designed for long-term progress</li>
              </ul>
              <Link
                href="/checkout?plan=yearly"
                className={classes.primaryButton}
              >
                Start Yearly
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
