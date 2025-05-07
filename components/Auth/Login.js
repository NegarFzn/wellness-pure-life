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
  const [rememberMe, setRememberMe] = useState(false); // optional — not used directly
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

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
    if (!email) {
      setError("Please enter your email to reset your password.");
      return;
    }

    try {
      const res = await axios.post("/api/send-reset", { email });
      toast.success(
        res.data.message || "📬 Reset email sent. Check your inbox."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not send reset email. Please check the address and try again."
      );
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
