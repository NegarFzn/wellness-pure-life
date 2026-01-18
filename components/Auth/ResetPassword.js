import { useState, useEffect } from "react";
import { gaEvent } from "../../lib/gtag";
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

  // VIEW
  useEffect(() => {
    gaEvent("auth_reset_view");
  }, []);

  const handleReset = async () => {
    gaEvent("auth_reset_submit");

    setError("");

    // EMPTY INPUTS
    if (!password || !confirmPassword) {
      gaEvent("auth_reset_empty_fields");
      setError("Please fill in both fields.");
      return;
    }

    // PASSWORD MISMATCH
    if (password !== confirmPassword) {
      gaEvent("auth_reset_password_mismatch");
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
        gaEvent("auth_reset_success");
        setSuccess(true);
        setTimeout(onClose, 2000);
      } else if (data.message === "Token expired") {
        gaEvent("auth_reset_token_expired");
        setExpired(true);
      } else {
        gaEvent("auth_reset_error", { error: data.message });
        setError(data.message || "Something went wrong.");
      }
    } catch {
      gaEvent("auth_reset_error", { error: "Unexpected network error" });
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    gaEvent("auth_reset_resend_attempt");

    setResendMessage("");

    if (!email) {
      gaEvent("auth_reset_resend_no_email");
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

      if (data.success) {
        gaEvent("auth_reset_resend_success", { email });
      } else {
        gaEvent("auth_reset_resend_error", { message: data.message });
      }

      setResendMessage(
        data.success ? "✅ Reset email sent!" : `❌ ${data.message}`
      );
    } catch {
      gaEvent("auth_reset_resend_error", { message: "Network failure" });
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
              onChange={(e) => {
                setPassword(e.target.value);
                gaEvent("auth_reset_new_password_input");
              }}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                gaEvent("auth_reset_confirm_password_input");
              }}
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
              onChange={(e) => {
                setEmail(e.target.value);
                gaEvent("auth_reset_expired_email_input");
              }}
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
