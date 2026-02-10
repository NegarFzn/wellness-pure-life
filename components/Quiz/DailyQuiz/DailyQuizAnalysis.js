import { useEffect, useState } from "react";
import { gaEvent } from "../../../lib/gtag"; // <-- ADD
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
import classes from "./DailyQuizAnalysis.module.css";

export default function DailyQuizAnalysis() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedType, setSelectedType] = useState(null);

  // ---- VIEW EVENT ----
  useEffect(() => {
    gaEvent("daily_quiz_analysis_view");
    gaEvent("key_daily_quiz_analysis_view");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/quiz/quiz-daily?mode=history");
        const data = await res.json();
        setHistory(Array.isArray(data.history) ? data.history : []);
      } catch (err) {
        console.error("Error fetching mood history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTypeClick = (type) => {
    gaEvent("daily_quiz_analysis_filter_type_click", { type });
    gaEvent("key_daily_quiz_analysis_filter_type_click", { type });

    setSelectedType((prev) => (prev === type ? null : type));
  };

  const exportToCSV = (data) => {
    gaEvent("daily_quiz_analysis_export_csv", { count: data.length });
    gaEvent("key_daily_quiz_analysis_export_csv", { count: data.length });

    const headers = ["Date", "Result"];
    const rows = data.map((entry) => {
      const result = Array.isArray(entry.answers)
        ? entry.answers[0]
        : entry.answers;
      const date = new Date(entry.savedAt).toISOString();
      return [date, result];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "daily_mood_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // Type counts
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
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const pieData = Object.entries(countByType).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#dc2626", "#16a34a", "#ca8a04", "#6b7280"];

  if (loading) {
    return <p className={classes.loading}>🔄 Loading mood trends...</p>;
  }

  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>🧘 Mood Trends & Stress Insights</h2>

      {/* ---- FILTER INPUT EVENT ---- */}
      <input
        type="text"
        placeholder="Search by result or date..."
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          gaEvent("daily_quiz_analysis_filter_input", {
            value: e.target.value,
          });
          gaEvent("key_daily_quiz_analysis_filter_input", {
            value: e.target.value,
          });
        }}
        className={classes.filterInput}
      />

      {/* ---- TYPE FILTER BUTTONS ---- */}
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
            onClick={() => {
              setSelectedType(null);
              gaEvent("daily_quiz_analysis_filter_clear");
              gaEvent("key_daily_quiz_analysis_filter_clear");
            }}
          >
            ✖️ Clear Filter
          </button>
        )}
      </div>

      {/* ---- EXPORT ---- */}
      <button
        className={classes.exportBtn}
        onClick={() => exportToCSV(filtered)}
      >
        📤 Export CSV
      </button>

      {/* ---- CHARTS ---- */}
      <div className={classes.chartContainer}>
        <h3
          onClick={() => {
            gaEvent("daily_quiz_analysis_chart_view", { chart: "line" });
            gaEvent("key_daily_quiz_analysis_chart_view", { chart: "line" });
          }}
        >
          📈 Daily Trends (Line)
        </h3>

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
      </div>

      <div className={classes.chartContainer}>
        <h3
          onClick={() => {
            gaEvent("daily_quiz_analysis_chart_view", { chart: "bar" });
            gaEvent("key_daily_quiz_analysis_chart_view", { chart: "bar" });
          }}
        >
          📊 Daily Totals (Bar)
        </h3>

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
      </div>

      <div className={classes.chartContainer}>
        <h3
          onClick={() => {
            gaEvent("daily_quiz_analysis_chart_view", { chart: "pie" });
            gaEvent("key_daily_quiz_analysis_chart_view", { chart: "pie" });
          }}
        >
          📌 Mood Distribution (Pie)
        </h3>

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

      {/* Mood Emoji Calendar */}
      <h3>🗓️ Mood Calendar</h3>
      <div className={classes.moodCalendar}>
        {chartData.map((day, idx) => {
          const topMood =
            day["High Stress"] > 0
              ? "⚠️"
              : day["Balanced"] > 0
                ? "🧘"
                : day["Low Stress"] > 0
                  ? "🌤️"
                  : "❓";

          return (
            <div key={idx} className={classes.moodDay}>
              <span className={classes.moodEmoji}>{topMood}</span>
              <span className={classes.moodDate}>{day.date}</span>
            </div>
          );
        })}
      </div>

      {/* ---- SCROLL LIST ---- */}
      <div
        className={classes.scrollList}
        onScroll={() => {
          gaEvent("daily_quiz_analysis_scroll");
        }}
      >
        {filtered.length === 0 ? (
          <p className={classes.empty}>😕 No entries found for this filter.</p>
        ) : (
          <ul className={classes.quizList}>
            {filtered.map((entry, idx) => {
              const result = Array.isArray(entry.answers)
                ? entry.answers[0]
                : entry.answers;
              return (
                <li key={idx} className={classes.quizItem}>
                  <strong>{result || "Unknown"}</strong>
                  <br />
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
        )}
      </div>
    </div>
  );
}
