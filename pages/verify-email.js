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

    const verify = async () => {
      try {
        const res = await fetch(`/api/verify-token?token=${token}`);
        if (!res.ok) {
          console.error("❌ Backend returned error:", res.status);
          setStatus("❌ Token verification failed.");
          return;
        }

        const data = await res.json();
        console.log("✅ VERIFY RESPONSE:", data);

        setStatus("✅ Your email is now verified! Please sign in again.");
        setTimeout(() => router.push("/"), 2500); // redirect to login
      } catch (error) {
        console.error("❌ Verification error:", error);
        setStatus("❌ Something went wrong. Please try again.");
      }
    };

    verify();
  }, [token]);

  return (
    <>
      <Head>
        <title>Email Verification</title>
      </Head>
      <div
        style={{ textAlign: "center", marginTop: "3rem", fontSize: "1.2rem" }}
      >
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
