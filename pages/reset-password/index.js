import { useState } from "react";
import axios from "axios";
import classes from "./index.module.css";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const res = await axios.post("/api/send-reset", { email });
      setMessage(res.data.message || "Reset link sent! Check your inbox.");
      setEmail("");

      // Auto-clear success message after 5 seconds
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Forgot Your Password?</h2>
      <form onSubmit={handleSubmit} className={classes.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className={classes.input}
          required
        />
        <button className={classes.button}>Send Reset Link</button>
      </form>
      {message && <p className={classes.success}>{message}</p>}
      {error && <p className={classes.error}>{error}</p>}
    </div>
  );
}
