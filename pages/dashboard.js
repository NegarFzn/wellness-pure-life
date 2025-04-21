import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import styles from "../styles/Dashboard.module.css"; // Optional CSS module

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { openLogin } = useUI();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      openLogin();
      router.push("/");
    }
  }, [loading, user]);

  if (loading || !user) return <p>Loading your dashboard...</p>;

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/"); // Go back to home after logout
  };

  return (
    <div className={styles.container}>
      <h1>Welcome, {user.displayName || user.email.split("@")[0]} 👋</h1>
      <p>Email: {user.email}</p>
      <p>Status: {user.emailVerified ? "Verified" : "Unverified"}</p>
      <button className={styles.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
