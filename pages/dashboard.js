import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { useUI } from "../context/UIContext";
import classes from "./dashboard.module.css";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { openLogin } = useUI();
  const router = useRouter();

  const [emailVerified, setEmailVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      openLogin();
      if (router.pathname !== "/") {
        router.push("/");
      }
    }
  }, [status, router]);

  // Email verification placeholder — not handled by NextAuth by default
  useEffect(() => {
    if (user?.email && router.query.emailVerified) {
      setEmailVerified(true); // simulate verification; update as needed if you support it
    }
  }, [user, router.query.emailVerified]);

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
          <button className={classes.verifyBtn} disabled>
            Resend Verification (pending NextAuth integration)
          </button>
          <button
            className={classes.verifyBtn}
            onClick={() => setEmailVerified(true)}
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
