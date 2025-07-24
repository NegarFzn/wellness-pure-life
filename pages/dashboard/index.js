import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession, signOut, getSession } from "next-auth/react";
import { useUI } from "../../context/UIContext";
import { toast } from "react-toastify";
import classes from "./index.module.css";

export default function DashboardPage() {
  const { data: initialSession, status } = useSession();
  const user = initialSession?.user;
  const { openLogin } = useUI();
  const router = useRouter();

  const [session, setSession] = useState(initialSession);
  const [resending, setResending] = useState(false);
  const [quizResults, setQuizResults] = useState([]);

  useEffect(() => {
    const refreshSession = async () => {
      const freshSession = await getSession();
      setSession(freshSession);
    };

    if (status === "authenticated") {
      refreshSession();
    }
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      openLogin();
      if (router.pathname !== "/") {
        router.push("/");
      }
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch("/api/quiz/user");
      if (res.ok) {
        const data = await res.json();
        setQuizResults(data);
      }
    };

    if (status === "authenticated") {
      fetchResults();
    }
  }, [status]);

  const emailVerified = session?.user?.emailVerified || false;

  const handleResendVerification = async () => {
    if (!user?.email) return;
    setResending(true);
    try {
      const res = await fetch("/api/auth/emailverification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      if (!res.ok) throw new Error("Failed to send verification email");
      toast.success(" Verification email sent.");
    } catch (error) {
      console.error(error);
      toast.error("❌ Error resending verification email.");
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") return <p>Loading your dashboard...</p>;

  return (
    <div className={classes.container}>
      {session?.user?.isPremium && (
        <div className={classes.premiumBadge}>
          <span className={classes.premiumIcon}>✨</span>
          <span>Premium Member</span>
        </div>
      )}
      <h1 className={classes.heading}>
        Welcome, {user?.name || user?.email?.split("@")[0] || "friend"} 👋
      </h1>
      <p className={classes.tag}>Email: {user?.email}</p>
      <p className={classes.tag}>
        Status: {emailVerified ? "✅ Verified" : "Unverified"}
      </p>

      <p className={classes.redirectNotice}>
        Redirecting to home in 15 seconds...
      </p>

      {!emailVerified && (
        <div className={classes.verifyNote}>
          <p>✉️ Please verify your email. Once done, return here.</p>
          <button
            className={classes.verifyBtn}
            onClick={handleResendVerification}
            disabled={resending}
          >
            {resending ? "Resending..." : "Resend Verification Email"}
          </button>
        </div>
      )}

      <div className={classes.quickLinks}>
        <button onClick={() => router.push("/mindfulness")}>
          🧘 Mind & Calm
        </button>
        <button onClick={() => router.push("/nourish")}>🍎 Nutrition</button>
        <button onClick={() => router.push("/fitness")}>🏋️ Fitness</button>
        <button onClick={() => router.push("/quizzes/history")}>
          🕘 View Full Quiz History
        </button>
      </div>

      {session?.user?.isPremium && (
        <div className={classes.premiumBox}>
          <h3>🌟 Your Premium Perks</h3>
          <ul>
            <li>🧘 Guided meditations</li>
            <li>🥗 Personalized meal plans</li>
            <li>🤖 AI Wellness Assistant access</li>
            <li>📊 Weekly health progress reports</li>
            <li>🛌 Sleep improvement tracker</li>
            <li>💬 1-on-1 coaching sessions</li>
            <li>📚 Exclusive articles and challenges</li>
            <li>🎧 Mindfulness audio library(coming soon)</li>
            <li>💡 Early access to new features</li>
          </ul>
        </div>
      )}

      {quizResults.length > 0 && (
        <div className={classes.quizHistory}>
          <h3>Your Quiz History</h3>
          <ul>
            {quizResults.map((result, index) => (
              <li key={index} className={classes.quizItem}>
                <strong>{result.slug}</strong> → <em>{result.result}</em> <br />
                <small>{new Date(result.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className={classes.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
