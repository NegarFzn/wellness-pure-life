import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import classes from "./index.module.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!router.isReady || !token) {
    return <p className={classes.message}>Loading reset form...</p>;
  }

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!token) {
      setError("Token missing or invalid. Please request a new reset link.");
      return;
    }

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
      setTimeout(() => router.push("/"), 2000); // redirect to home
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Reset failed. Try again or request a new link."
      );
    }
  };

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
