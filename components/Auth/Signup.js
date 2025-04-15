import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import classes from "./Signup.module.css";

export default function Signup({
  isOpen,
  onClose,
  onSignupComplete,
  switchToLogin,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("justSignedUp", "true");
      window.dispatchEvent(new Event("storage")); // 👈 Trigger updates in other components

      if (onSignupComplete) onSignupComplete(); // ✅ notify parent
      onClose();
      setSuccess(true);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError(
          <>
            This email is already registered.{" "}
            <button
              type="button"
              className={classes.linkButton}
              onClick={() => {
                onClose();
                if (switchToLogin) switchToLogin();
              }}
            >
              Log in instead
            </button><br/> or entre new email.
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
        if (e.target === e.currentTarget) onClose(); // 👈 close only if overlay itself is clicked
      }}
    >
      <div className={classes.modal}>
        <button className={classes.close} onClick={onClose}>
          &times;
        </button>
        <h2 className={classes.title}>Join Wellness Pure Life</h2>
        <p className={classes.subtitle}>
          Get free access to our weekly wellness tips 🌿
        </p>
        <form onSubmit={handleSignup} className={classes.form}>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={classes.input}
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={classes.input}
          />
          <button type="submit" className={classes.button}>
            Sign Up Free
          </button>
          {error && <p className={classes.error}>{error}</p>}
          {success && (
            <p className={classes.success}>✅ You're in! Check your inbox.</p>
          )}
        </form>
      </div>
    </div>
  );
}
