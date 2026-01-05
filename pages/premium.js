import Head from "next/head";
import Link from "next/link";
import classes from "./premium.module.css";

export default function PremiumPage() {
  const features = [
    {
      title: "Sleep Reset",
      desc: "Fall asleep faster, wake up less at night, and restore deep, restorative sleep.",
      sampleType: null,
    },
    {
      title: "Stress Reset",
      desc: "Rapidly calm emotional overload, anxiety, and physical tension.",
      sampleType: null,
    },
    {
      title: "Daily Rituals Pro",
      desc: "Morning, midday, and evening rituals for clarity, calm, and steady energy.",
      sampleType: "daily",
    },
    {
      title: "Weekly Wellness Plan",
      desc: "A full 7-day structure based on your quiz answers — movement, recovery, and focus.",
      sampleType: "weekly",
    },
    {
      title: "AI Wellness Coach",
      desc: "Instant guidance for routines, sleep, stress, habits, and nutrition.",
      sampleType: null,
    },
    {
      title: "Habit & Progress Tracking",
      desc: "Build consistency with streaks for sleep, movement, hydration, and rituals.",
      sampleType: null,
    },
    {
      title: "Easy Nutrition Structure",
      desc: "Simple meals, weekly guidance, smart snack ideas, and hydration planning.",
      sampleType: null,
    },
    {
      title: "Premium Workouts",
      desc: "Strength, mobility, low-impact, and fat-burning routines.",
      sampleType: null,
    },
    {
      title: "Premium Articles",
      desc: "Deep, structured wellness education for long-term understanding and growth.",
      sampleType: null,
    },
  ];

  return (
    <>
      <Head>
        <title>Wellness Pure Life Pro | Personalized Premium Membership</title>
        <meta
          name="description"
          content="Unlock personalized weekly plans, daily rituals, sleep reset, stress reset, AI coaching, nutrition structure, and premium workouts with Wellness Pure Life Pro."
        />
      </Head>

      <main className={classes.page}>

        {/* ============================= */}
        {/* HERO SECTION — STRONGER COPY */}
        {/* ============================= */}
        <section className={classes.hero}>
          <div className={classes.heroBg} />

          <p className={classes.eyebrow}>Premium Membership</p>

          <h1 className={classes.title}>
            Transform Your Body & Mind with{" "}
            <span className={classes.gradientText}>Wellness Pure Life Pro</span>
          </h1>

          <p className={classes.subtitle}>
            Your personalized, science-based wellness system for better sleep,
            calmer stress, deeper focus, stable energy, and steady emotional balance.
          </p>

          <ul className={classes.heroList}>
            <li>Personalized weekly plan</li>
            <li>Daily rituals & routines</li>
            <li>AI wellness coaching</li>
            <li>Sleep & stress reset</li>
            <li>Nutrition structure</li>
          </ul>

          <div className={classes.heroActions}>
            <Link href="#pricing" className={classes.primaryButton}>
              Start Free Trial
            </Link>
            <Link href="/quizzes/quiz-main" className={classes.secondaryButton}>
              Take Free Wellness Quiz
            </Link>
          </div>
        </section>

        {/* ================================= */}
        {/* PREMIUM FEATURES — CLEANER CARDS */}
        {/* ================================= */}
        <section className={classes.section}>
          <header className={classes.sectionHeader}>
            <h2 className={classes.sectionTitle}>What’s Inside Premium</h2>
            <p className={classes.sectionSubtitle}>
              A complete wellness system designed to support your mind and body every day.
            </p>
          </header>

          <div className={classes.featureGrid}>
            {features.map((f, i) => (
              <div key={i} className={classes.featureCard}>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>

                {f.sampleType === "weekly" && (
                  <Link href="/sample/weekly-plan" className={classes.sampleButton}>
                    See Sample Weekly Plan
                  </Link>
                )}

                {f.sampleType === "daily" && (
                  <Link href="/sample/daily-routine" className={classes.sampleButton}>
                    See Sample Daily Routine
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ===================================== */}
        {/* FREE VS PREMIUM — CLEANER COMPARISON */}
        {/* ===================================== */}
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
                  ["Weekly wellness plan", "✖", "✔"],
                  ["Daily Rituals Pro", "✖", "✔"],
                  ["Premium workouts", "✖", "✔"],
                  ["Sleep Reset", "✖", "✔"],
                  ["Stress Reset", "✖", "✔"],
                  ["Easy nutrition structure", "✖", "✔"],
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

        {/* ================================= */}
        {/* PRICING — STRONGER MICROCOPY     */}
        {/* ================================= */}
        <section id="pricing" className={classes.section}>
          <header className={classes.sectionHeader}>
            <h2 className={classes.sectionTitle}>Choose Your Plan</h2>
            <p className={classes.sectionSubtitle}>
              Full access to the entire premium system — personalized weekly plans,
              daily rituals, sleep reset, stress reset, AI coaching, and more.
            </p>
          </header>

          <div className={classes.pricingGrid}>
            {/* MONTHLY PLAN */}
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
              <Link href="/upgrade" className={classes.primaryButton}>
                Start Monthly
              </Link>
            </div>

            {/* YEARLY PLAN */}
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
              <Link href="/upgrade" className={classes.primaryButton}>
                Start Yearly
              </Link>
            </div>
          </div>
        </section>

        {/* ================================= */}
        {/* GUARANTEE SECTION                 */}
        {/* ================================= */}
        <section className={classes.guarantee}>
          <div className={classes.guaranteeCard}>
            <div className={classes.guaranteeHeader}>
              <span className={classes.guaranteeIcon}>✨</span>
              <h3 className={classes.guaranteeTitle}>7-Day Satisfaction Guarantee</h3>
            </div>

            <p className={classes.guaranteeText}>
              Try Premium with complete peace of mind. If within 7 days you feel no
              improvement in your sleep, focus, energy, or emotional balance, you can
              cancel instantly — no questions asked.
            </p>

            <p className={classes.guaranteeNote}>
              We offer this because we are confident in the real-world impact of this system.
            </p>
          </div>
        </section>

        {/* ================================= */}
        {/* TRANSFORMATION SECTION            */}
        {/* ================================= */}
        <section className={classes.section}>
          <header className={classes.sectionHeader}>
            <h2 className={classes.sectionTitle}>What Changes After You Go Premium</h2>
            <p className={classes.sectionSubtitle}>
              This is more than access to features — it is a shift in how your body and
              mind function daily.
            </p>
          </header>

          <div className={classes.transformationGrid}>
            <div className={classes.transformationCard}>
              <h3>Daily</h3>
              <p>
                Your mornings start calm and structured. You avoid emotional overload and
                gain clarity for the whole day.
              </p>
            </div>

            <div className={classes.transformationCard}>
              <h3>Weekly</h3>
              <p>
                You stop improvising your life. You follow an intelligent weekly structure
                that eliminates decision fatigue.
              </p>
            </div>

            <div className={classes.transformationCard}>
              <h3>Emotional</h3>
              <p>
                Stress no longer dictates your reactions. You learn how to regulate your
                emotions with calm precision.
              </p>
            </div>

            <div className={classes.transformationCard}>
              <h3>Energy</h3>
              <p>
                Your energy becomes steady and predictable. You recover deeply instead of
                burning out.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
