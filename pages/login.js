// pages/login.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";
import { signIn, useSession } from "next-auth/react"; // 👉 UPDATED
import { gaEvent } from "../lib/gtag";
import "react-toastify/dist/ReactToastify.css";
import classes from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const { redirect, plan } = router.query; // 👉 ADDED
  const { data: session } = useSession(); // 👉 ADDED

  // PAGE VIEW
  useEffect(() => {
    gaEvent("auth_login_page_view");
  }, []);

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

 useEffect(() => {
  if (session && redirect === "upgrade") {
    startStripeCheckout(plan || "monthly"); // direct checkout, no UpgradePage
  }
}, [session, redirect, plan]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    gaEvent("auth_login_submit", { email });

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      gaEvent("auth_login_success", { email });

      localStorage.removeItem("justSignedUp");
      setSuccess(true);

      // 👉 If upgrade flow, we DO NOT push to dashboard here.
      if (redirect === "upgrade") return;

      router.push("/dashboard");
    } else {
      gaEvent("auth_login_error", { email });
      setError("Invalid email or password.");
    }
  };

  const handleResetPassword = async () => {
    gaEvent("auth_login_reset_password_click");
    setError(null);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email to reset your password.");
      return;
    }

    try {
      await axios.post("/api/auth/reset-password", { email });
      toast.success("📬 Reset email sent. Check your inbox.");

      gaEvent("auth_login_reset_password_success", { email });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not send reset email. Try again."
      );

      gaEvent("auth_login_reset_password_error", { email });
    }
  };

  const startStripeCheckout = async (plan) => {
  try {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        uid: session.user.uid,
        plan,
      }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
  } catch (err) {
    toast.error("Could not start checkout.");
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
            onChange={(e) => {
              setEmail(e.target.value);
              gaEvent("auth_login_email_input");
            }}
            required
          />

          <label className={classes.label}>Password</label>
          <input
            type="password"
            className={classes.input}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              gaEvent("auth_login_password_input");
            }}
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
            <Link
              href="/signup"
              className={classes.signupLink}
              onClick={() => gaEvent("auth_login_switch_to_signup")}
            >
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
