import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import classes from "./history.module.css";

export default function QuizHistory() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/quizzes?user=true")
        .then((res) => res.json())
        .then((data) => {
          setHistory(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const countByType = {
    "High Stress": 0,
    Balanced: 0,
    "Low Stress": 0,
    Unknown: 0,
  };

  history.forEach((q) => {
    const key =
      q.result === "High Stress" ||
      q.result === "Balanced" ||
      q.result === "Low Stress"
        ? q.result
        : "Unknown";
    countByType[key]++;
  });

  const filtered = history.filter((q) => {
    const matchesTitle = q.slug.toLowerCase().includes(filter.toLowerCase());
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

  if (status === "loading" || loading) {
    return <p className={classes.loading}>🔄 Loading your quiz history...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <div className={classes.authBox}>
        <h2>🔐 You must be signed in to view your quiz history.</h2>
      </div>
    );
  }

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

      {/* Filter summary buttons */}
      <div className={classes.summary}>
        <button
          className={`${classes.summaryBtn} ${
            selectedType === "Balanced" ? classes.active : ""
          }`}
          onClick={() => handleTypeClick("Balanced")}
        >
          🧘 {countByType["Balanced"]}
        </button>
        <button
          className={`${classes.summaryBtn} ${
            selectedType === "High Stress" ? classes.active : ""
          }`}
          onClick={() => handleTypeClick("High Stress")}
        >
          ⚠️ {countByType["High Stress"]}
        </button>
        <button
          className={`${classes.summaryBtn} ${
            selectedType === "Low Stress" ? classes.active : ""
          }`}
          onClick={() => handleTypeClick("Low Stress")}
        >
          🌤️ {countByType["Low Stress"]}
        </button>
        <button
          className={`${classes.summaryBtn} ${
            selectedType === "Unknown" ? classes.active : ""
          }`}
          onClick={() => handleTypeClick("Unknown")}
        >
          ❓ {countByType["Unknown"]}
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

      {filtered.length === 0 ? (
        <p className={classes.empty}>
          😕 No quizzes matched{" "}
          <span className={classes.alert}>"{filter}"</span>{" "}
          {selectedType ? `of type "${selectedType}"` : ""}.
        </p>
      ) : (
        <div className={classes.scrollList}>
          <ul className={classes.quizList}>
            {filtered.map((entry, idx) => (
              <li key={idx} className={classes.quizItem}>
                <strong>{entry.slug}</strong> — Result:{" "}
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
                <br />
                <small>{new Date(entry.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
