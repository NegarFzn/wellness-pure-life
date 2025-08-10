// pages/login.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";
import { signIn } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import classes from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasToastFired = sessionStorage.getItem("verifiedToastShown");

    if (router.query.verified === "true" && !hasToastFired) {
      toast.success("Email verified successfully. Please log in.");
      sessionStorage.setItem("verifiedToastShown", "true");
      const { verified, ...rest } = router.query;
      router.replace({ pathname: router.pathname, query: rest }, undefined, {
        shallow: true,
      });
    }
  }, [router]);

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
      router.push("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  const handleResetPassword = async () => {
    setError(null);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email to reset your password.");
      return;
    }

    try {
      await axios.post("/api/auth/reset-password", { email });
      toast.success("📬 Reset email sent. Check your inbox.");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not send reset email. Try again."
      );
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <h2 className={classes.title}>Login to Wellness Pure Life</h2>

        <form onSubmit={handleLogin} className={classes.form}>
          <label className={classes.label}>Email</label>
          <input
            type="email"
            className={classes.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className={classes.label}>Password</label>
          <input
            type="password"
            className={classes.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
            className={classes.linkButton}
            onClick={handleResetPassword}
          >
            Forgot your password?
          </button>
          <p className={classes.signupBelow}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className={classes.signupLink}>
              Sign up here
            </Link>
          </p>

          {error && <p className={classes.error}>{error}</p>}
          {success && <p className={classes.success}>✅ Login successful!</p>}
        </form>
      </div>
    </div>
  );
}
