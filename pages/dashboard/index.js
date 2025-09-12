import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import DailyQuizAnalysis from "../../components/Quiz/DailyQuiz/DailyQuizAnalysis";
import classes from "./index.module.css";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [section, setSection] = useState("overview");
  const [dailyData, setDailyData] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [planData, setPlanData] = useState(null);

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
      `/api/quiz/quiz-main?mode=saved&email=${encodeURIComponent(user.email)}`
    )
      .then((res) => res.json())
      .then(async (data) => {
        const latest = [...(data.history || [])].sort(
          (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
        )[0];
        if (!latest || !latest.answers || !latest.slug) return;
        const rec = await fetch(
          `/api/quiz/quiz-main?mode=saved&email=${encodeURIComponent(
            user.email
          )}`
        )
          .then((r) => r.json())
          .catch(() => ({}));
        setMainData([{ ...latest, ...rec }]);
      });

    fetch(
      `/api/quiz/quiz-plan?mode=history&email=${encodeURIComponent(user.email)}`
    )
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...(data.history || [])].sort(
          (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
        );
        const matched = sorted.find(
          (entry) => entry.email === user.email || entry.email === null
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
        (a, b) => new Date(a.date) - new Date(b.date)
      ),
    };
  };

  if (status === "loading") return <p>Loading...</p>;

  const { count } = getMoodSummary();

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <h1 className={classes.title}>
          Welcome, {user?.name || user?.email?.split("@")[0]} 👋
        </h1>
        <p className={classes.tag}>Email: {user?.email}</p>
        <p className={classes.tag}>
          Status: {user?.emailVerified ? "✅ Verified" : "Unverified"}
        </p>
        <div className={classes.tabBar}>
          {["overview", "daily", "main", "plan", user?.isPremium && "premium"]
            .filter(Boolean)
            .map((s) => (
              <button
                key={s}
                onClick={() =>
                  setSection((prev) => (prev === s ? "overview" : s))
                }
                className={section === s ? classes.activeTab : ""}
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
      </header>

      <main className={classes.main}>
        {section === "overview" && (
          <div className={classes.overviewSection}>
            <div className={classes.heroBanner}>
              <h2 className={classes.sectionTitle}>👋 Welcome back</h2>
              <p className={classes.sectionIntro}>
                Here’s a quick summary of your wellness. Choose a section to
                explore:
              </p>

              {user?.isPremium && (
                <div className={classes.welcomeStickers}>
                  <span className={classes.sticker}>💎</span>
                  <span className={classes.sticker}>🌟</span>
                  <span className={classes.sticker}>💖</span>
                  <span className={classes.sticker}>🎊</span>
                </div>
              )}
            </div>

            <div className={classes.wellnessSummary}>
              <h3>🗓️ Today’s Summary</h3>
              <p>
                {count.Balanced > 0
                  ? `You’re feeling balanced today. Great job staying mindful! 🌿`
                  : count["High Stress"] > 0
                  ? `It looks like you're under stress. Try a breathing exercise. 🧘`
                  : `Let’s check in with your mood today.`}
              </p>
              <button
                onClick={() => setSection("daily")}
                className={classes.summaryButton}
              >
                ➕ Add Mood Check-In
              </button>
            </div>

            <div className={classes.progressStats}>
              <div className={classes.statItem}>
                📅 Mood Entries: <strong>{dailyData.length}</strong>
              </div>
              <div className={classes.statItem}>
                📋 Plan: <strong>{planData ? "✅" : "❌"}</strong>
              </div>
              <div className={classes.statItem}>
                🧠 Insight: <strong>{mainData[0]?.matchedTitle || "–"}</strong>
              </div>
            </div>

            <div className={classes.sectionGrid}>
              <SectionCard
                icon="📅"
                title="Mood Check-Ins"
                description="Track your emotional trends with daily mood quizzes."
                onClick={() => setSection("daily")}
              />
              <SectionCard
                icon="🧠"
                title="General Insights"
                description="Insights from the general wellness quiz."
                onClick={() => setSection("main")}
              />
              <SectionCard
                icon="📋"
                title="Your Plan"
                description="Personalized plan from quizzes."
                onClick={() => setSection("plan")}
              />
            </div>
          </div>
        )}

        {section === "daily" && <DailyQuizAnalysis />}

        {section === "main" && (
          <div className={classes.mainInsights}>
            <h2 className={classes.sectionTitle}>🧠 Your Insights</h2>
            {mainData.length === 0 ? (
              <p className={classes.emptyMessage}>
                🤖 No insights yet.{" "}
                <button
                  onClick={() => router.push("/quizzes")}
                  className={classes.primaryBtn}
                >
                  Take Quiz Now
                </button>
              </p>
            ) : (
              mainData.map((entry, idx) => (
                <div key={idx} className={classes.card}>
                  <h3 className={classes.cardTitle}>
                    {entry.matchedTitle || "🔍 Insight"}
                  </h3>
                  {entry.matchedDescription && (
                    <p className={classes.cardDescription}>
                      {entry.matchedDescription}
                    </p>
                  )}
                  <div className={classes.answerList}>
                    {Object.entries(entry.answers || {}).map(([k, v]) => (
                      <p key={k}>
                        <strong>{k}:</strong> {v}
                      </p>
                    ))}
                  </div>
                  {Array.isArray(entry.matchedValues) && (
                    <ul className={classes.recommendationList}>
                      {entry.matchedValues.map((item, i) => (
                        <li key={i}>✅ {item}</li>
                      ))}
                    </ul>
                  )}
                  <small className={classes.timestamp}>
                    Saved at: {new Date(entry.savedAt).toLocaleString()}
                  </small>
                </div>
              ))
            )}
          </div>
        )}

        {section === "plan" && (
          <div className={classes.planSection}>
            <h2 className={classes.planTitle}>📋 Your Plan</h2>
            {planData ? (
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
                  {planData.matchedPlan?.structure?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
                {planData.matchedPlan?.energy && (
                  <p className={classes.planEnergy}>
                    {planData.matchedPlan.energy}
                  </p>
                )}
              </>
            ) : (
              <p>
                ⚠️ No saved plan found. Please complete the fitness plan quiz to
                generate one.
              </p>
            )}
          </div>
        )}

        {section === "premium" && user?.isPremium && (
          <div className={classes.premiumSection}>
            <div className={classes.welcomeStickers}>
              <span className={classes.sticker}>✨</span>
              <span className={classes.sticker}>💖</span>
              <span className={classes.sticker}>🌈</span>
              <span className={classes.sticker}>🎉</span>
            </div>
            <h2>✨ Premium Benefits</h2>
            <ul>
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
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Logout
        </button>
      </footer>
    </div>
  );
}
