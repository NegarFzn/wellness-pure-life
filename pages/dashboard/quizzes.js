// /pages/dashboard/quizzes.js
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import classes from "./quizzes.module.css";

const suggestionsMap = {
  Calm: [
    { label: "Try a Guided Meditation", path: "/mindfulness" },
    { label: "Explore Calming Meals", path: "/nourish" },
  ],
  Energized: [
    { label: "Power Workout Plan", path: "/fitness" },
    { label: "Energy-Boosting Meals", path: "/nourish" },
  ],
  Tired: [
    { label: "Sleep Improvement Guide", path: "/mindfulness" },
    { label: "Gentle Fitness Routines", path: "/fitness" },
  ],
};

export default function QuizHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    } else if (status === "authenticated") {
      axios
        .get("/api/quiz/history")
        .then((res) => setHistory(res.data))
        .catch((err) => console.error("Error loading history", err));
    }
  }, [status]);

  if (status === "loading")
    return <p className={classes.loading}>Loading...</p>;

  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case "calm":
        return "🧘";
      case "energized":
        return "💪";
      case "tired":
        return "😴";
      default:
        return "🧩";
    }
  };

  const filteredHistory =
    filter === "All"
      ? history
      : history.filter(
          (entry) => entry.result.toLowerCase() === filter.toLowerCase()
        );

  const resultTypes = ["All", ...new Set(history.map((entry) => entry.result))];

  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>📚 Your Quiz History</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="filter">Filter by result: </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {resultTypes.map((type, idx) => (
            <option key={idx} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {filteredHistory.length === 0 ? (
        <p className={classes.empty}>No quizzes match this filter.</p>
      ) : (
        <ul className={classes.list}>
          {filteredHistory.map((entry, idx) => (
            <li
              key={idx}
              className={classes.item}
              onClick={() => router.push(`/quizzes/${entry.slug}`)}
            >
              <div className={classes.icon}>{getIcon(entry.result)}</div>
              <div className={classes.details}>
                <strong>{entry.slug}</strong> — <em>{entry.result}</em>
                <br />
                <small>{new Date(entry.createdAt).toLocaleString()}</small>
                <br />
                <span className={classes.retake}>🔁 Retake this quiz</span>
                {suggestionsMap[entry.result] && (
                  <ul style={{ marginTop: "0.5rem" }}>
                    {suggestionsMap[entry.result].map((sug, i) => (
                      <li key={i}>
                        👉{" "}
                        <a href={sug.path} style={{ color: "#10b981" }}>
                          {sug.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
