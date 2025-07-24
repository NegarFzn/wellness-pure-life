import { useState } from "react";
import { useSession } from "next-auth/react";
import classes from "./recommendationsAdmin.module.css";

export default function QuizRecommendationAdmin() {
  const { data: session } = useSession();
  const [form, setForm] = useState({ type: "", title: "", description: "" });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const res = await fetch("/api/admin/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage({ type: "success", text: "Recommendation added." });
      setForm({ type: "", title: "", description: "" });
    } else {
      setMessage({ type: "error", text: data.error || "Submission failed." });
    }
  };

  if (!session || !session.user?.isAdmin) {
    return <p className={classes.unauthorized}>Admins only</p>;
  }

  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>Add Recommendation</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="type"
          placeholder="Result Type (e.g., High Stress)"
          value={form.type}
          onChange={handleChange}
          className={classes.input}
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Recommendation Title"
          value={form.title}
          onChange={handleChange}
          className={classes.input}
          required
        />
        <textarea
          name="description"
          placeholder="Recommendation Description"
          value={form.description}
          onChange={handleChange}
          className={classes.textarea}
          required
        />
        <button type="submit" className={classes.button}>
          Submit
        </button>
      </form>
      {message && (
        <p
          className={`${classes.message} ${
            message.type === "success" ? classes.success : classes.error
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
