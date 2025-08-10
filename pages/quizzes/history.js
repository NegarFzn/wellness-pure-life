import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useUI } from "../../context/UIContext";
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

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/quizzes?user=true")
        .then((res) => res.json())
        .then((data) => {
          setHistory(Array.isArray(data) ? data : []);
        })
        .finally(() => setLoading(false));
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className={classes.container}>
        <p className={classes.loading}>🔄 Loading your quiz history...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className={classes.authBox}>
        <div className={classes.authCard}>
          <h2>🔐 Please log in to view your quiz history.</h2>
          <button className={classes.authBtn} onClick={openLogin}>
            🔑 Log In
          </button>
        </div>
      </div>
    );
  }

  // Count and group logic
  const countByType = {
    "High Stress": 0,
    Balanced: 0,
    "Low Stress": 0,
    Unknown: 0,
    "Daily Quiz": 0,
  };

  const dailyMap = {};

  history.forEach((q) => {
    const slug = (q.slug || q.quizSlug || "").toLowerCase();
    const key = ["High Stress", "Balanced", "Low Stress"].includes(q.result)
      ? q.result
      : "Unknown";
    countByType[key]++;

    const isDaily =
      q.isDaily === true || slug === "daily-quiz" || slug === "daily-checkin";
    if (isDaily) countByType["Daily Quiz"]++;

    const dateKey = new Date(q.createdAt).toISOString().split("T")[0];
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

  const pieData = Object.entries(countByType)
    .filter(([key]) => key !== "Daily Quiz")
    .map(([key, value]) => ({ name: key, value }));

  const COLORS = ["#dc2626", "#16a34a", "#ca8a04", "#6b7280"];

  const filtered = history.filter((q) => {
    const slug = (q.slug || q.quizSlug || "").toLowerCase();
    const matchesTitle = slug.includes(filter.toLowerCase());
    const matchesType =
      !selectedType ||
      (selectedType === "Unknown"
        ? !["High Stress", "Balanced", "Low Stress"].includes(q.result)
        : q.result === selectedType);
    return matchesTitle && matchesType;
  });

  const handleTypeClick = (type) => {
    setSelectedType((prev) => (prev === type ? null : type));
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>📘 My Quiz History</h1>

      <input
        type="text"
        placeholder="Search quizzes by title..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className={classes.filterInput}
      />

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

        <button className={classes.summaryBtn} disabled>
          🗓️ Daily Quiz: {countByType["Daily Quiz"]}
        </button>

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
        <h2>📈 Daily Quiz Results (Line)</h2>
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

        <h2>📊 Daily Quiz Totals (Bar)</h2>
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

        <h2>📌 Overall Quiz Distribution (Pie)</h2>
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
          😕 No quizzes matched{" "}
          <span className={classes.alert}>"{filter}"</span>{" "}
          {selectedType ? `of type "${selectedType}"` : ""}.
        </p>
      ) : (
        <div className={classes.scrollList}>
          <ul className={classes.quizList}>
            {filtered.map((entry, idx) => {
              const slug = entry.slug || entry.quizSlug;
              const isDaily =
                entry.isDaily === true ||
                (slug || "").toLowerCase() === "daily-quiz" ||
                (slug || "").toLowerCase() === "daily-checkin";
              return (
                <li key={idx} className={classes.quizItem}>
                  <strong>{slug}</strong> — Result:{" "}
                  <em
                    className={
                      entry.result === "High Stress"
                        ? classes.highStress
                        : entry.result === "Balanced"
                        ? classes.balanced
                        : entry.result === "Low Stress"
                        ? classes.lowStress
                        : classes.unknown
                    }
                  >
                    {entry.result}
                  </em>
                  {isDaily && <span> 🗓️</span>}
                  <br />
                  <small>{new Date(entry.createdAt).toLocaleString()}</small>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
