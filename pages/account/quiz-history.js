// /pages/account/quiz-history.js
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";

export default function QuizHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState([]);

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

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📚 Your Quiz History</h1>
      {history.length === 0 ? (
        <p>You haven't taken any quizzes yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {history.map((entry, idx) => (
            <li
              key={idx}
              style={{
                background: "#f3f4f6",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                cursor: "pointer",
              }}
              onClick={() => router.push(`/quizzes/${entry.slug}`)}
            >
              <strong>{entry.slug}</strong> — <em>{entry.result}</em>
              <br />
              <small>{new Date(entry.createdAt).toLocaleString()}</small>
              <br />
              <span style={{ color: "#3b82f6" }}>🔁 Retake this quiz</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
