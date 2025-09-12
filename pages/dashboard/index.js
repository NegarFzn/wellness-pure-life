import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import DailyQuizAnalysis from "../../components/Quiz/DailyQuiz/DailyQuizAnalysis";
import classes from "./index.module.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [section, setSection] = useState("overview");
  const [dailyData, setDailyData] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [planData, setPlanData] = useState(null);
  const COLORS = ["#dc2626", "#16a34a", "#ca8a04", "#6b7280"];

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (!user?.email) return;

    // 🟦 1. Fetch DAILY mood history
    fetch("/api/quiz/quiz-daily?mode=history")
      .then((res) => res.json())
      .then((data) => setDailyData(data.history || []));

    // 🟨 2. Fetch MAIN quiz saved answers from new endpoint
    fetch(
      `/api/quiz/quiz-main?mode=saved&email=${encodeURIComponent(user.email)}`
    )
      .then((res) => res.json())
      .then(async (data) => {
        const latest = [...(data.history || [])].sort(
          (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
        )[0];

        if (!latest || !latest.answers || !latest.slug) return;

        // Construct recommendation query from answers
        const params = new URLSearchParams({ slug: latest.slug });
        Object.entries(latest.answers).forEach(([key, value]) => {
          params.append(key, value);
        });

        // Fetch recommendation
        const rec = await fetch(
          `/api/quiz/quiz-main?mode=saved&email=${encodeURIComponent(
            user.email
          )}`
        )
          .then((r) => r.json())
          .catch((err) => {
            console.error("Error fetching recommendation:", err);
            return {};
          });

        setMainData([{ ...latest, ...rec }]);
      })
      .catch((err) => {
        console.error("Error fetching main quiz saved history:", err);
      });

    // 🟩 3. Fetch PLAN quiz history
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

  const { count, chart } = getMoodSummary();
  const pieData = Object.entries(count).map(([name, value]) => ({
    name,
    value,
  }));

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
                  ? "📅 Mood"
                  : s === "main"
                  ? "🧘 Insights"
                  : s === "plan"
                  ? "🗂️ Plan"
                  : "✨ Premium"}
              </button>
            ))}
        </div>
      </header>
      {user?.isPremium && (
        <div className={classes.premiumBanner}>
          <div className={classes.confetti}></div>
          <h2 className={classes.premiumHeading}>
            👑 You're a Premium Member!
          </h2>
          <p className={classes.premiumSub}>
            Thank you for supporting Wellness Pure Life. Enjoy your exclusive
            features!
          </p>
        </div>
      )}

      <main className={classes.main}>
        {section === "overview" && (
          <div className={classes.overviewSection}>
            <p className={classes.overviewIntro}>
              🔍 A quick glance into your wellness trends and goals.
            </p>
            <div className={classes.buttonGroup}>
              <button onClick={() => setSection("daily")}>
                📈 View Mood Trends
              </button>
              <button onClick={() => setSection("plan")}>
                🗂️ See Your Plan
              </button>
            </div>
          </div>
        )}

        {section === "daily" && (
          <div>
            <DailyQuizAnalysis />
          </div>
        )}

        {section === "main" && (
          <div className={classes.mainInsights}>
            <h2 className={classes.sectionTitle}>🧘 Your Insights</h2>
            {mainData.length === 0 ? (
              <p>
                ⚠️ No insights found. Please complete a quiz to get started.
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

                  {Array.isArray(entry.matchedValues) &&
                    entry.matchedValues.length > 0 && (
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
            <h2 className={classes.planTitle}>🗂️ Your Plan</h2>

            {planData ? (
              <>
                {/* TAGS (Optional: Extract from title or use hardcoded if needed) */}
                <div className={classes.planTagRow}>
                  {planData.matchedPlan?.title?.split("|").map((tag, i) => (
                    <span key={i} className={classes.planTag}>
                      {tag.trim()}
                    </span>
                  ))}
                </div>

                {/* SUMMARY */}
                <p className={classes.planSummary}>
                  {planData.matchedPlan?.summary}
                </p>

                {/* STRUCTURE LIST */}
                <ul className={classes.planList}>
                  {planData.matchedPlan?.structure?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>

                {/* ENERGY LINE (optional extra info) */}
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
            <h2>✨ Premium Benefits</h2>
            <ul>
              <li>🧘 Guided meditations</li>
              <li>🥗 Personalized meal plans</li>
              <li>🤖 AI Wellness Assistant access</li>
              <li>📊 Weekly health progress reports</li>
              <li>🛌 Sleep improvement tracker</li>
              <li>💬 1-on-1 coaching sessions</li>
              <li>📚 Exclusive articles and challenges</li>
              <li>🎧 Mindfulness audio library</li>
              <li>💡 Early access to new features</li>
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
