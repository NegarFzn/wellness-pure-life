import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { gaEvent } from "../../lib/gtag";
import classes from "./ResetPassword.module.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // PAGE VIEW EVENTS
  useEffect(() => {
    gaEvent("auth_reset_page_view");
    gaEvent("key_auth_reset_page_view");
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");

    gaEvent("auth_reset_page_submit");
    gaEvent("key_auth_reset_page_submit");

    if (!password || !confirm) {
      gaEvent("auth_reset_page_empty_fields");
      gaEvent("key_auth_reset_page_empty_fields");
      setMessage("Both fields are required.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      gaEvent("auth_reset_page_password_mismatch");
      gaEvent("key_auth_reset_page_password_mismatch");
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
        gaEvent("auth_reset_page_success");
        gaEvent("key_auth_reset_page_success");

        setMessage("Password updated successfully. Redirecting...");
        setTimeout(() => router.push("/"), 2000);
      }
    } catch (err) {
      gaEvent("auth_reset_page_error", {
        message: err.response?.data?.message,
      });
      gaEvent("key_auth_reset_page_error");

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
            onChange={(e) => {
              setPassword(e.target.value);
              gaEvent("auth_reset_page_new_password_input");
              gaEvent("key_auth_reset_page_new_password_input");
            }}
            className={classes.input}
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              gaEvent("auth_reset_page_confirm_password_input");
              gaEvent("key_auth_reset_page_confirm_password_input");
            }}
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
