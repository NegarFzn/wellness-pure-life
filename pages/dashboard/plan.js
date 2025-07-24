// /pages/dashboard/plan.js
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import classes from "./plan.module.css";

export default function WellnessPlanPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [latestQuiz, setLatestQuiz] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    } else if (status === "authenticated") {
      axios
        .get("/api/quiz/history")
        .then((res) => {
          const sorted = res.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setLatestQuiz(sorted[0]);
        })
        .catch((err) => console.error("Error loading quiz history", err));
    }
  }, [status]);

  if (status === "loading")
    return <p className={classes.loading}>Loading...</p>;

  const getSuggestions = (result) => {
    if (!result) return [];
    switch (result.toLowerCase()) {
      case "calm":
        return [
          { label: "🧘 Daily Meditation", href: "/mindfulness" },
          { label: "🥗 Light Meals", href: "/nourish" },
        ];
      case "energized":
        return [
          { label: "🏋️ High-Intensity Workouts", href: "/fitness" },
          { label: "🍽️ Energy Meals", href: "/nourish" },
        ];
      case "tired":
        return [
          { label: "😴 Sleep Programs", href: "/mindfulness" },
          { label: "🧘 Gentle Yoga", href: "/fitness" },
        ];
      default:
        return [{ label: "🌿 Explore All Wellness Areas", href: "/" }];
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>🌱 Your Personalized Wellness Plan</h1>
      {latestQuiz ? (
        <div className={classes.card}>
          <h2 className={classes.result}>
            You are a <span>{latestQuiz.result}</span> type
          </h2>
          <p className={classes.summary}>
            Based on your most recent quiz: <strong>{latestQuiz.slug}</strong>
          </p>
          <div className={classes.suggestions}>
            {getSuggestions(latestQuiz.result).map((sug, i) => (
              <a key={i} href={sug.href} className={classes.suggestionLink}>
                {sug.label}
              </a>
            ))}
          </div>
        </div>
      ) : (
        <p className={classes.empty}>
          No quiz results yet. <a href="/quizzes">Take one now!</a>
        </p>
      )}
    </div>
  );
}
