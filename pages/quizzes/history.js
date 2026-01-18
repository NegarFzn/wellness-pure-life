import { useEffect, useState } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useUI } from "../../context/UIContext";
import { useRouter } from "next/router";
import { gaEvent } from "../../lib/gtag";
import classes from "./history.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function QuizHistory() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const { openLogin } = useUI();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      gaEvent("quiz_daily_history_page_loaded", {
        user: session?.user?.email || "anonymous",
      });
    }
    const fetchDailyHistory = async () => {
      try {
        const res = await fetch("/api/quiz/quiz-daily?mode=history");
        const data = await res.json();
        const dailyHistory = Array.isArray(data.history) ? data.history : [];
        setHistory(dailyHistory);
        gaEvent("quiz_daily_history_fetched", {
          count: dailyHistory.length,
        });
      } catch (err) {
        console.error("Failed to fetch daily history:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchDailyHistory();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className={classes.container}>
        <p className={classes.loading}>🔄 Loading your daily check-ins...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className={classes.authBox}>
        <div className={classes.authCard}>
          <h2>🔐 Please log in to view your daily history.</h2>
          <button className={classes.authBtn} onClick={openLogin}>
            🔑 Log In
          </button>
        </div>
      </div>
    );
  }

  // Apply filters first
  const filtered = history.filter((q) => {
    const result = Array.isArray(q.answers) ? q.answers[0] : q.answers;

    const matchesType =
      !selectedType ||
      (selectedType === "Unknown"
        ? !["High Stress", "Balanced", "Low Stress"].includes(result)
        : result === selectedType);

    const formattedDate = new Date(q.savedAt).toISOString().split("T")[0];

    const searchQuery = filter.toLowerCase().replace(/\s+/g, "");
    const matchesSearch =
      filter.trim() === "" ||
      formattedDate.includes(searchQuery) ||
      result.toLowerCase().replace(/\s+/g, "").includes(searchQuery);

    return matchesType && matchesSearch;
  });

  // Count result types based on filtered results
  const countByType = {
    "High Stress": 0,
    Balanced: 0,
    "Low Stress": 0,
    Unknown: 0,
  };

  const dailyMap = {};

  filtered.forEach((q) => {
    const result = Array.isArray(q.answers) ? q.answers[0] : q.answers;
    const key = ["High Stress", "Balanced", "Low Stress"].includes(result)
      ? result
      : "Unknown";

    countByType[key]++;

    const dateKey = new Date(q.savedAt).toISOString().split("T")[0];
    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = {
        date: dateKey,
        Balanced: 0,
        "High Stress": 0,
        "Low Stress": 0,
        Unknown: 0,
      };
    }
    dailyMap[dateKey][key]++;
  });

  const chartData = Object.values(dailyMap).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const pieData = Object.entries(countByType).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#dc2626", "#16a34a", "#ca8a04", "#6b7280"];

  const handleTypeClick = (type) => {
    setSelectedType((prev) => (prev === type ? null : type));
    gaEvent("quiz_daily_filter_type", {
      type: type || "all",
    });
  };

  return (
    <>
      <Head>
        <title> Quizzes History | Wellness Pure Life</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>{" "}
      <div className={classes.container}>
        <h1 className={classes.heading}>🧘‍♀️ Daily Mood & Stress Check-ins</h1>

        <input
          type="text"
          placeholder="Search quizzes by title..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            gaEvent("quiz_daily_history_search", { query: e.target.value });
          }}
          className={classes.filterInput}
        />

        <div className={classes.dailyTotalWrapper}>
          <span className={classes.dailyTotal}>
            🗓️ Total Daily Quiz: {history.length}
          </span>
        </div>

        <div className={classes.summary}>
          {["Balanced", "High Stress", "Low Stress", "Unknown"].map((type) => (
            <button
              key={type}
              className={`${classes.summaryBtn} ${
                selectedType === type ? classes.active : ""
              }`}
              onClick={() => handleTypeClick(type)}
            >
              {type === "Balanced"
                ? "🧘"
                : type === "High Stress"
                ? "⚠️"
                : type === "Low Stress"
                ? "🌤️"
                : "❓"}{" "}
              {type} ({countByType[type]})
            </button>
          ))}

          {selectedType && (
            <button
              className={classes.clearFilter}
              onClick={() => setSelectedType(null)}
            >
              ✖️ Clear Filter
            </button>
          )}
        </div>

        <div className={classes.chartSection}>
          <h2>📈 Daily Trends (Line)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="High Stress" stroke="#dc2626" />
              <Line type="monotone" dataKey="Balanced" stroke="#16a34a" />
              <Line type="monotone" dataKey="Low Stress" stroke="#ca8a04" />
              <Line type="monotone" dataKey="Unknown" stroke="#6b7280" />
            </LineChart>
          </ResponsiveContainer>

          <h2>📊 Daily Result Totals (Bar)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="High Stress" fill="#dc2626" />
              <Bar dataKey="Balanced" fill="#16a34a" />
              <Bar dataKey="Low Stress" fill="#ca8a04" />
              <Bar dataKey="Unknown" fill="#6b7280" />
            </BarChart>
          </ResponsiveContainer>

          <h2>📌 Overall Mood Distribution (Pie)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {filtered.length === 0 ? (
          <p className={classes.empty}>
            😕 No daily entries found for{" "}
            {selectedType ? `"${selectedType}"` : "the current filter"}.
          </p>
        ) : (
          <div className={classes.scrollList}>
            <ul className={classes.quizList}>
              {filtered.map((entry, idx) => {
                const result = Array.isArray(entry.answers)
                  ? entry.answers[0]
                  : entry.answers;
                return (
                  <li key={idx} className={classes.quizItem}>
                    <strong>Result: {result || "N/A"}</strong> <br />
                    <small>
                      {new Date(entry.savedAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </small>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
