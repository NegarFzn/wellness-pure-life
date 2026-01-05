import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import classes from "./ResetPassword.module.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!password || !confirm) {
      setMessage("Both fields are required.");
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });

      if (res.data.success) {
        setMessage("Password updated successfully. Redirecting...");
        setTimeout(() => router.push("/"), 2000);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <p className={classes.loading}>Loading...</p>;

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <h2 className={classes.title}>Reset Your Password</h2>

        <form onSubmit={handleReset} className={classes.form}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={classes.input}
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={classes.input}
          />

          <button type="submit" className={classes.button} disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>

          {message && <p className={classes.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
}
