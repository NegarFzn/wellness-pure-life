import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import classes from "./Login.module.css";

export default function Login({
  isOpen,
  onClose,
  onLoginSuccess,
  switchToSignup,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // ✅ Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.removeItem("justSignedUp");
      setSuccess(true);
      if (onLoginSuccess) onLoginSuccess(); // ✅ trigger callback
      onClose(); // ✅ close modal on success
      setTimeout(() => {
        setSuccess(false); // hide message
        router.push("/");
      }, 100);
    } catch (err) {
      setError(
        <>
          Invalid email or password.{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (switchToSignup) switchToSignup();
            }}
            className={classes.linkButton}
          >
            Sign up here
          </button>
        </>
      );
    }
  };

  const handleResetPassword = async () => {
    setError(null);
    if (!email) {
      setError("Please enter your email to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("📬 Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(
        "Could not send reset email. Please check the address and try again."
      );
    }
  };

  if (!isOpen) return null;

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
        <form onSubmit={handleLogin} className={classes.form}>
          <h2 className={classes.title}>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={classes.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={classes.input}
          />
          <button type="submit" className={classes.button}>
            Login
          </button>
          <button
            type="button"
            onClick={handleResetPassword}
            className={classes.linkButton}
          >
            Forgot your password?
          </button>

          {error && <p className={classes.error}>{error}</p>}
          {success && <p className={classes.success}>✅ Login successful!</p>}
        </form>
      </div>
    </div>
  );
}
