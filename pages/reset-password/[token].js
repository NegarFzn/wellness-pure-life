import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import classes from "./index.module.css";


export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  console.log(token);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [valid, setValid] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    console.log("🔍 ROUTER READY:", router.isReady);
    console.log("🔑 TOKEN:", token);
  }, [router.isReady, token]);
  

  useEffect(() => {
    if (!router.isReady || !token) return;

    const validateToken = async () => {
      try {
        const res = await axios.get(`/api/validate-reset-token?token=${token}`);
        setValid(res.data.valid);
      } catch {
        setValid(false);
      } finally {
        setChecking(false);
      }
    };

    validateToken();
  }, [router.isReady, token]);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("/api/reset-password", {
        token,
        password,
      });

      setMessage(res.data.message || "✅ Password reset successful.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Reset failed. Try again or request a new link."
      );
    }
  };

  if (checking)
    return <p className={classes.message}>🔄 Verifying reset token...</p>;
  if (!valid)
    return (
      <p className={classes.error}>❌ This reset link is invalid or expired.</p>
    );

  return (
    <div className={classes.container}>
      <h2>Reset Your Password 🔐</h2>
      <form onSubmit={handleReset} className={classes.form}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
        {message && <p className={classes.success}>{message}</p>}
        {error && <p className={classes.error}>{error}</p>}
      </form>
    </div>
  );
}


