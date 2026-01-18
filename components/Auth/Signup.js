import { useState, useEffect } from "react";
import { gaEvent } from "../../lib/gtag";
import classes from "./Signup.module.css";

export default function Signup({
  isOpen,
  onClose,
  onSignupComplete,
  switchToLogin,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Reset state on modal close
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess(false);
    } else {
      gaEvent("auth_signup_view"); // TRACK SIGNUP VIEW
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignup = async (e) => {
    e.preventDefault();
    gaEvent("auth_signup_submit", { email }); // TRACK SUBMIT

    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      gaEvent("auth_signup_password_mismatch"); // 👉 ADDED
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Unexpected server error. Please try again later.");
      }

      if (!res.ok) throw new Error(data.message || "Signup failed");

      setSuccess(true);
      gaEvent("auth_signup_success", { email }); // TRACK SUCCESS

      setTimeout(() => {
        const successMsg = document.querySelector(`.${classes.success}`);
        if (successMsg) successMsg.classList.add(classes.successFlash);
      }, 10);

      if (onSignupComplete) onSignupComplete();
    } catch (err) {
      gaEvent("auth_signup_error", {
        email,
        error: err.message,
      }); // TRACK ERROR

      if (err.message.includes("Email already in use")) {
        setError(
          <>
            This email is already registered.{" "}
            <button
              type="button"
              className={classes.linkButton}
              onClick={() => {
                gaEvent("auth_signup_switch_to_login"); // 👉 ADDED
                onClose();
                if (switchToLogin) switchToLogin();
              }}
            >
              Log in instead
            </button>{" "}
            or enter a new email.
          </>
        );
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div
      className={classes.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          gaEvent("auth_signup_modal_close"); // 👉 ADDED
          onClose();
        }
      }}
    >
      <div className={classes.modal}>
        <button
          className={classes.close}
          onClick={() => {
            gaEvent("auth_signup_modal_close"); // 👉 ADDED
            onClose();
          }}
        >
          &times;
        </button>

        <h2 className={classes.title}>Join Wellness Pure Life</h2>
        <p className={classes.subtitle}>
          Get free access to our weekly wellness tips 🌿
        </p>

        <form onSubmit={handleSignup} className={classes.form}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              gaEvent("auth_signup_name_input"); // 👉 ADDED
            }}
            required
            className={classes.input}
          />

          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              gaEvent("auth_signup_email_input"); // 👉 ADDED
            }}
            required
            className={classes.input}
          />

          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              gaEvent("auth_signup_password_input"); // 👉 ADDED
            }}
            required
            className={classes.input}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              gaEvent("auth_signup_confirm_password_input"); // 👉 ADDED
            }}
            required
            className={classes.input}
          />

          <button type="submit" className={classes.button} disabled={success}>
            {success ? "✅ Signed Up" : "Sign Up Free"}
          </button>

          {error && <p className={classes.error}>{error}</p>}

          {success && (
            <p className={`${classes.success} ${classes.attention}`}>
              <span role="img" aria-label="email" className={classes.emailIcon}>
                📩
              </span>
              Please check your email to verify your account.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
