import { useState } from "react";
import axios from "axios";
import classes from "./index.module.css";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("/api/send-reset", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
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
      {message && <p className={classes.message}>{message}</p>}
    </div>
  );
}
