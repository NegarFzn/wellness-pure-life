import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useAuth } from "../context/AuthContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState("Verifying...");
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (!token || typeof token !== "string") return;

    const waitForEmailVerification = async (user, maxAttempts = 5, delayMs = 2000) => {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await user.reload();
        if (getAuth().currentUser?.emailVerified) {
          return true;
        }
        await new Promise((res) => setTimeout(res, delayMs));
      }
      return false;
    };

    const verify = async () => {
      try {
        // Step 1: Validate token on backend
        const res = await fetch(`/api/verify-token?token=${token}`);
        if (!res.ok) {
          console.error("❌ Backend returned error:", res.status);
          setStatus("❌ Token verification failed.");
          return;
        }

        const data = await res.json();
        console.log("✅ VERIFY RESPONSE:", data);

        // Step 2: Sync Firebase auth session
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          unsubscribe(); // ✅ Clean up

          if (!user) {
            setStatus("🔒 You're not signed in. Please log in to complete verification.");
            return;
          }

          try {
            const isVerified = await waitForEmailVerification(user);
            if (isVerified) {
              await refreshUser(); // 🔄 Sync global auth state
              setStatus("✅ Email verified successfully!");
              setTimeout(() => router.push("/dashboard?emailVerified=true"), 1500);
            } else {
              setStatus("⚠️ Verification failed to sync. Please try again.");
            }
          } catch (syncErr) {
            console.error("🔥 Sync error:", syncErr);
            setStatus("❌ Could not sync verification. Please try logging in again.");
          }
        });
      } catch (error) {
        console.error("❌ Client-side error during verification:", error);
        setStatus("❌ Something went wrong during verification.");
      }
    };

    verify();
  }, [token]);

  return (
    <>
      <Head>
        <title>Email Verification</title>
      </Head>
      <div style={{ textAlign: "center", marginTop: "3rem", fontSize: "1.2rem" }}>
        {status}
        {status.includes("not signed in") && (
          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={() => router.push("/")}
              style={{
                padding: "10px 20px",
                background: "#4F46E5",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </>
  );
}
