import { useState } from "react";
import classes from "./ResetPassword.module.css";

export default function ResetPassword({ token, onClose }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [expired, setExpired] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleReset = async () => {
    setError("");
    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(onClose, 2000);
      } else if (data.message === "Token expired") {
        setExpired(true);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch {
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMessage("");
    if (!email) {
      setResendMessage("Please enter your email.");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResendMessage(
        data.success ? "✅ Reset email sent!" : `❌ ${data.message}`
      );
    } catch {
      setResendMessage("❌ Failed to send reset link.");
    }
  };

  return (
    <div className={classes.backdrop}>
      <div className={classes.modal}>
        {!expired ? (
          <>
            <h2 className={classes.title}>Create a New Password</h2>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p className={classes.errorText}>{error}</p>}
            {success && (
              <p className={classes.successText}>
                ✅ Password reset successful
              </p>
            )}
            <button
              onClick={handleReset}
              disabled={loading}
              className={classes.primaryButton}
            >
              {loading ? "Submitting..." : "Reset Password"}
            </button>
          </>
        ) : (
          <>
            <h2 className={classes.title}>This link has expired</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleResend} className={classes.primaryButton}>
              Resend Reset Link
            </button>
            {resendMessage && (
              <p className={classes.successText}>{resendMessage}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
