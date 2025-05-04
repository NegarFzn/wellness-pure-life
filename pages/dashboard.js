import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { signOut, getAuth } from "firebase/auth";
import { auth } from "../lib/firebase";
import { handleVerifyEmail } from "../utils/sendVerificationEmail";
import classes from "./dashboard.module.css";

export default function DashboardPage() {
  const { user, loading, isPremium, refreshUser } = useAuth();
  const { openLogin } = useUI();
  const router = useRouter();
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      openLogin();
      if (router.pathname !== "/") {
        router.push("/");
      }
    }
  }, [loading, user, router]);

  // Check and sync email verification status
  const checkVerificationStatus = async () => {
    try {
      setVerifying(true);
      await refreshUser();
      const refreshed = await getAuth().currentUser?.reload().then(() => getAuth().currentUser);
      setEmailVerified(refreshed?.emailVerified || false);
    } catch (err) {
      console.error("Failed to check email verification:", err);
    } finally {
      setVerifying(false);
    }
  };

  // Auto-check if query param ?emailVerified=true is present
  useEffect(() => {
    if (user && router.query.emailVerified) {
      checkVerificationStatus();
    }
  }, [user, router.query.emailVerified]);

  // Clean up query param from URL
  useEffect(() => {
    if (router.query.emailVerified) {
      const { emailVerified, ...rest } = router.query;
      router.replace(
        {
          pathname: router.pathname,
          query: rest,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router.query.emailVerified]);

  const handleManualRefresh = async () => {
    await checkVerificationStatus();
  };

  if (loading || !user) return <p>Loading your dashboard...</p>;

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className={classes.container}>
      {isPremium && (
        <div className={classes.premiumBadge}>✨ Premium Member</div>
      )}
      <h1 className={classes.heading}>
        Welcome, {user.displayName || user.email?.split("@")[0] || "friend"} 👋
      </h1>
      <p className={classes.tag}>Email: {user.email}</p>
      <p className={classes.tag}>
        Status: {emailVerified ? "✅ Verified" : "Unverified"}
      </p>
      {!emailVerified && (
        <div className={classes.verifyNote}>
          <p>✉️ Please verify your email. Once done, return here.</p>
          <button
            className={classes.verifyBtn}
            onClick={() => handleVerifyEmail(user)}
          >
            Resend Verification
          </button>
          <button
            className={classes.verifyBtn}
            onClick={handleManualRefresh}
            disabled={verifying}
          >
            {verifying ? "Refreshing..." : "Refresh Verification Status"}
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
      {isPremium && (
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
