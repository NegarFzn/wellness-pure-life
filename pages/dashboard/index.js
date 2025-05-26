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

      toast.success("✅ Verification email sent.");
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
        <div className={classes.premiumBadge}>✨ Premium Member</div>
      )}
      <h1 className={classes.heading}>
        Welcome, {user?.name || user?.email?.split("@")[0] || "friend"} 👋
      </h1>
      <p className={classes.tag}>Email: {user?.email}</p>
      <p className={classes.tag}>
        Status: {emailVerified ? "✅ Verified" : "Unverified"}
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
      </div>

      {session?.user?.isPremium && (
        <div className={classes.premiumBox}>
          <h3>🌟 Your Premium Perks</h3>
          <ul>
            <li>🧘 Guided meditations</li>
            <li>🥗 Personalized meal plans</li>
            <li>🤖 AI Wellness Assistant access</li>
          </ul>
        </div>
      )}
      <button className={classes.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
