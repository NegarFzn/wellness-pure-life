import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";
import { signIn } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import classes from "./Login.module.css";

export default function Login({
  isOpen,
  onClose,
  onLoginSuccess,
  switchToSignup,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // ✅ Show toast if redirected after verification (only once)
  useEffect(() => {
    const hasToastFired = sessionStorage.getItem("verifiedToastShown");

    if (router.query.verified === "true" && !hasToastFired) {
      toast.success("✅ Email verified successfully. Please log in.");
      sessionStorage.setItem("verifiedToastShown", "true");

      const { verified, ...rest } = router.query;
      router.replace({ pathname: router.pathname, query: rest }, undefined, {
        shallow: true,
      });
    }
  }, [router]);

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

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      localStorage.removeItem("justSignedUp");
      setSuccess(true);
      if (onLoginSuccess) onLoginSuccess();
      onClose();
      router.push("/dashboard");
    } else {
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

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email to reset your password.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/reset-password", { email });
      toast.success("📬 Reset email sent. Check your inbox.");
    } catch (err) {
      if (err?.response?.status === 404) {
        setError("This email is not registered. Please sign up first.");
      } else {
        setError(
          err?.response?.data?.message ||
            "Could not send reset email. Please try again."
        );
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={classes.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
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
          <div className={classes.checkboxRow}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>

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
          <p className={classes.switchText}>
            Don't have an account?{" "}
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
          </p>
        </form>
      </div>
    </div>
  );
}
