import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import DailyQuizAnalysis from "../../components/Quiz/DailyQuiz/DailyQuizAnalysis";
import QuizCard from "../../components/Quiz/QuizCard/QuizCard";
import MultiStartQuiz from "../../components/Quiz/QuizPlan/1_StartQuiz";
import DailyRitual from "../../components/DailyRitual";
import WeeklyPlanCard from "../../components/Plan/WeeklyPlanCard";
import {gaEvent} from "../../lib/gtag";
import classes from "./index.module.css";

const planTypes = [
  { type: "fitness", label: "💪 Fitness Plan" },
  { type: "mindfulness", label: "🧘 Mindfulness Plan" },
  { type: "nourish", label: "🥗 Nourish Plan" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [section, setSection] = useState("overview");
  const [dailyData, setDailyData] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [planData, setPlanData] = useState(null);

  useEffect(() => {
    gaEvent("dashboard_view");
    gaEvent("key_dashboard_view");
  }, []);

  const handleQuizOpen = (type) => {
    gaEvent("dashboard_plan_quiz_open", { type });
    gaEvent("key_dashboard_plan_quiz_open", { type });

    setActiveQuiz(type); // triggers useEffect
  };

  const closeQuizModal = () => {
    setActiveQuiz(null);
  };

  const SectionCard = ({ icon, title, description, onClick }) => (
    <button onClick={onClick} className={classes.sectionCard}>
      <div className={classes.sectionCardContent}>
        <span className={classes.sectionCardIcon}>{icon}</span>
        <div>
          <h3 className={classes.sectionCardTitle}>{title}</h3>
          <p className={classes.sectionCardDescription}>{description}</p>
        </div>
      </div>
    </button>
  );

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (!user?.email) return;

    fetch("/api/quiz/quiz-daily?mode=history")
      .then((res) => res.json())
      .then((data) => setDailyData(data.history || []));

    fetch(
      `/api/quiz/quiz-main?mode=saved&email=${encodeURIComponent(user.email)}`,
    )
      .then((res) => res.json())
      .then(async (data) => {
        const latest = [...(data.history || [])].sort(
          (a, b) => new Date(b.savedAt) - new Date(a.savedAt),
        )[0];
        if (!latest || !latest.answers || !latest.slug) return;
        const rec = await fetch(
          `/api/quiz/quiz-main?mode=saved&email=${encodeURIComponent(
            user.email,
          )}`,
        )
          .then((r) => r.json())
          .catch(() => ({}));
        setMainData([{ ...latest, ...rec }]);
      });

    fetch(
      `/api/quiz/quiz-plan?mode=history&email=${encodeURIComponent(user.email)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...(data.history || [])].sort(
          (a, b) => new Date(b.savedAt) - new Date(a.savedAt),
        );
        const matched = sorted.find(
          (entry) =>
            (entry.email === user.email || entry.email === null) &&
            entry.matchedPlan &&
            typeof entry.matchedPlan === "object",
        );
        setPlanData(matched || null);
      });
  }, [user?.email]);

  const getMoodSummary = () => {
    const count = {
      "High Stress": 0,
      Balanced: 0,
      "Low Stress": 0,
      Unknown: 0,
    };
    const map = {};
    dailyData.forEach((q) => {
      const r = Array.isArray(q.answers) ? q.answers[0] : q.answers;
      const k = ["High Stress", "Balanced", "Low Stress"].includes(r)
        ? r
        : "Unknown";
      count[k]++;
      const d = new Date(q.savedAt).toISOString().split("T")[0];
      map[d] ||= {
        date: d,
        "High Stress": 0,
        Balanced: 0,
        "Low Stress": 0,
        Unknown: 0,
      };
      map[d][k]++;
    });
    return {
      count,
      chart: Object.values(map).sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      ),
    };
  };

  if (status === "loading") return <p>Loading...</p>;

  const { count } = getMoodSummary();

  return (
    <>
      <Head>
        <title>Your Wellness Dashboard | Wellness Pure Life</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={classes.container}>
        <div className={classes.dashboardHero}>
          <div className={classes.heroContentGrid}>
            {/* LEFT SIDE — Welcome Content */}
            <div className={classes.heroLeft}>
              <div className={classes.heroTopRow}>
                <h1 className={classes.heroTitle}>
                  Welcome{user?.name ? ` ${user.name}` : ""} 👋
                </h1>

                {user?.isPremium && (
                  <div className={classes.premiumBadge}>
                    <span className={classes.star}>💎</span> Premium Member
                  </div>
                )}
              </div>

              <div className={classes.heroMeta}>
                <span>
                  <strong>Email:</strong> {user?.email}
                </span>
                <span>
                  <strong>Status:</strong>{" "}
                  {user?.emailVerified ? "✅ Verified" : "⚠️ Unverified"}
                </span>
              </div>

              <p className={classes.heroDesc}>
                Your wellness dashboard is ready. What would you like to focus
                on today?
              </p>

              <div className={classes.quickActions}>
                <Link href="/mindfulness">
                  <button
                    className={classes.actionBtn}
                    onClick={() => {
                      gaEvent("dashboard_quick_action", {
                        action: "mindfulness",
                      });
                      gaEvent("key_dashboard_quick_action", {
                        action: "mindfulness",
                      });
                    }}
                  >
                    🧠 Mind
                  </button>
                </Link>

                <Link href="/fitness">
                  <button
                    className={classes.actionBtn}
                    onClick={() => {
                      gaEvent("dashboard_quick_action", { action: "fitness" });
                      gaEvent("key_dashboard_quick_action", {
                        action: "fitness",
                      });
                    }}
                  >
                    💪 Body
                  </button>
                </Link>

                <Link href="/nourish">
                  <button
                    className={classes.actionBtn}
                    onClick={() => {
                      gaEvent("dashboard_quick_action", { action: "nourish" });
                      gaEvent("key_dashboard_quick_action", {
                        action: "nourish",
                      });
                    }}
                  >
                    🥗 Nutrition
                  </button>
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE — Ritual Card */}
            <div className={classes.heroRight}>
              <div className={classes.ritualCardWrapper}>
                <DailyRitual isPremium={user?.isPremium} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={classes.tabBarWrapper}>
            <div className={classes.tabBar}>
              {[
                "overview",
                "daily",
                "main",
                "plan",
                user?.isPremium && "premium",
              ]
                .filter(Boolean)
                .map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      gaEvent("dashboard_section_change", { section: s });
                      gaEvent("key_dashboard_section_change", { section: s });

                      setSection((prev) => (prev === s ? "overview" : s));
                    }}
                    className={`${classes.tabButton} ${
                      section === s ? classes.activeTab : ""
                    }`}
                  >
                    {s === "overview"
                      ? "🏠 Overview"
                      : s === "daily"
                        ? "📅 Mood Check-Ins"
                        : s === "main"
                          ? "🧠 General Insights"
                          : s === "plan"
                            ? "📋 Your Plan"
                            : "✨ Premium"}
                  </button>
                ))}
            </div>
          </div>
        </div>

        <main className={classes.main}>
          {section === "overview" && (
            <div className={classes.overviewSection}>
              <div className={classes.sectionGrid}>
                {/* Mood Card */}
                <div className={classes.cardWrapper}>
                  <div className={classes.innerStatBadge}>
                    📅 <strong>{dailyData.length}</strong>
                  </div>

                  <SectionCard
                    icon="📅"
                    title="Mood Check-Ins"
                    description="Track your emotional trends with daily mood quizzes."
                    onClick={() => {
                      gaEvent("dashboard_section_card_click", {
                        section: "daily",
                      });
                      gaEvent("key_dashboard_section_card_click", {
                        section: "daily",
                      });
                      setSection("daily");
                    }}
                    className={`${classes.sectionCard} ${classes.insight}`}
                    variant="insight"
                  />
                </div>

                {/* Insight Card */}
                <div className={classes.cardWrapper}>
                  <div className={classes.innerStatBadge}>
                    🧠 <strong>{mainData[0]?.matchedTitle || "—"}</strong>
                  </div>

                  <SectionCard
                    icon="🧠"
                    title="General Insights"
                    description="Insights from the general wellness quiz."
                    onClick={() => setSection("main")}
                    className={`${classes.sectionCard} ${classes.insight}`}
                    variant="insight"
                  />
                </div>

                {/* Plan Card */}
                <div className={classes.cardWrapper}>
                  <div className={classes.innerStatBadge}>
                    📋 <strong>{planData ? "✅ Active" : "❌ None"}</strong>
                  </div>

                  <SectionCard
                    icon="📋"
                    title="Your Plan"
                    description="Personalized plan from quizzes."
                    onClick={() => setSection("plan")}
                    className={`${classes.sectionCard} ${classes.insight}`}
                    variant="insight"
                  />
                </div>
              </div>
            </div>
          )}

          {section === "daily" && <DailyQuizAnalysis />}
          <WeeklyPlanCard />

          {section === "main" && (
            <div
              className={classes.mainInsights}
              role="region"
              aria-label="General Wellness Insights"
            >
              <h2 className={classes.sectionTitle}>🧠 Your Insights</h2>
              <p className={classes.planSubtitle}>
                Tailored to your quiz answers:
              </p>

              {/* ✅ Loop over insights if available */}
              {mainData.length > 0 ? (
                mainData.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`${classes.card} ${classes.fadeInOnScroll}`}
                  >
                    {/* 🟦 User Answers */}
                    <section className={classes.planTagRow}>
                      {Object.entries(entry.answers || {}).map(([k, v]) => (
                        <span key={k} className={classes.planTag}>
                          {`${k}: ${v}`}
                        </span>
                      ))}
                    </section>

                    {/* 🟨 Summary box */}
                    {entry.matchedDescription && (
                      <blockquote className={classes.cardDescription}>
                        {entry.matchedDescription}
                      </blockquote>
                    )}

                    {/* ✅ Recommendations list */}
                    {Array.isArray(entry.matchedValues) && (
                      <ul className={classes.recommendationList}>
                        {entry.matchedValues.map((item, i) => (
                          <li key={i}>{item}</li> // Icon handled in CSS ::before
                        ))}
                      </ul>
                    )}

                    {/* ⏱️ Timestamp */}
                    <small className={classes.timestamp}>
                      Saved at: {new Date(entry.savedAt).toLocaleString()}
                    </small>
                  </div>
                ))
              ) : (
                <p className={classes.emptyMessage}>
                  🤖 No insights yet. Start your wellness discovery today.
                </p>
              )}

              {/* 🧠 Quiz CTA */}
              <div className={classes.noPlan}>
                <p className={classes.noPlanText}>
                  💡 Want to explore your general wellness? Take the quiz below:
                </p>
                <div className={classes.planLinksGrid}>
                  <button
                    className={classes.takePlanLink}
                    onClick={() => {
                      gaEvent("dashboard_open_main_quiz");
                      gaEvent("key_dashboard_open_main_quiz");
                      setShowQuiz(true);
                    }}
                  >
                    <span role="img" aria-label="Brain">
                      🧠
                    </span>{" "}
                    Take Main Quiz
                  </button>
                </div>
              </div>

              {/* ✅ Modal */}
              {showQuiz && (
                <div
                  className={classes.modalOverlay}
                  onClick={() => setShowQuiz(false)}
                >
                  <div
                    className={classes.modalContent}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={classes.closeModal}
                      onClick={() => setShowQuiz(false)}
                      aria-label="Close"
                    >
                      ❌
                    </button>
                    <QuizCard />
                  </div>
                </div>
              )}
            </div>
          )}

          {section === "plan" && (
            <div
              className={classes.planSection}
              role="region"
              aria-label="Your Personalized Plan"
            >
              <h2 className={classes.planTitle}>📋 Your Plan</h2>
              <p className={classes.planSubtitle}>
                Tailored to your quiz answers:
              </p>

              {/* ✅ Show user’s plan if it exists */}
              {planData?.matchedPlan && (
                <>
                  <div className={classes.planTagRow}>
                    {planData.matchedPlan?.title?.split("|").map((tag, i) => (
                      <span key={i} className={classes.planTag}>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  <p className={classes.planSummary}>
                    {planData.matchedPlan?.summary}
                  </p>

                  <ul className={classes.planList}>
                    {planData.matchedPlan?.structure?.map((s, i) => {
                      const [day, ...rest] = s.split(":");
                      const title = rest.join(":").trim();
                      return (
                        <li key={i}>
                          <div className={classes.textBox}>
                            <strong>{day.trim()}:</strong>
                            <span>{title}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {planData.matchedPlan?.energy && (
                    <p className={classes.planEnergy}>
                      {planData.matchedPlan.energy}
                    </p>
                  )}
                </>
              )}

              {/* ✅ Always show quiz retake options */}
              <div className={classes.noPlan}>
                <p className={classes.noPlanText}>
                  💡 Want to improve your wellness? Retake any plan quiz below:
                </p>
                <div className={classes.planLinksGrid}>
                  {planTypes.map(({ type, label }) => (
                    <button
                      key={type}
                      onClick={() => handleQuizOpen(type)}
                      className={classes.takePlanLink}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ✅ Modal for MultiStartQuiz */}
              {activeQuiz && (
                <div
                  className={classes.modalOverlay}
                  onClick={() => closeQuizModal()}
                >
                  <div
                    className={classes.modalContent}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={classes.closeModal}
                      onClick={() => closeQuizModal()}
                    >
                      ❌
                    </button>
                    {activeQuiz && (
                      <MultiStartQuiz slug={`${activeQuiz}-plan`} />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {section === "premium" && user?.isPremium && (
            <div className={classes.premiumSection}>
              <div className={classes.premiumBadgeBanner}>
                <div className={classes.badge}>🌟 Premium Member</div>
                <p className={classes.tagline}>
                  You now have full access to exclusive features!
                </p>
              </div>

              <div className={classes.welcomeStickers}>
                <span className={classes.sticker}>✨</span>
                <span className={classes.sticker}>💖</span>
                <span className={classes.sticker}>🌈</span>
                <span className={classes.sticker}>🎉</span>
              </div>

              <h2 className={classes.premiumTitle}>✨ Premium Benefits</h2>

              <ul className={classes.premiumList}>
                <li>🧘 Guided meditations</li>
                <li>🥗 Personalized meal plans</li>
                <li>🤖 AI Wellness Assistant access</li>
                <li>📊 Weekly health progress reports</li>
                <li>🛌 Sleep improvement tracker</li>
                <li>💬 1-on-1 coaching sessions</li>
              </ul>
            </div>
          )}
        </main>

        <footer className={classes.footer}>
          <button
            className={classes.logoutBtn}
            onClick={() => {
              gaEvent("dashboard_logout_click");
              gaEvent("key_dashboard_logout_click");
              signOut({ callbackUrl: "/" });
            }}
          >
            Logout
          </button>
        </footer>
      </div>
    </>
  );
}
