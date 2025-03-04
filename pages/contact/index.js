import { useState } from "react";
import Head from "next/head";
import classes from "./index.module.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMessage("Message sent successfully! ✅");
        setFormData({ name: "", email: "", message: "" }); // Clear form
      } else {
        setResponseMessage("Failed to send message. ❌");
      }
    } catch (error) {
      setResponseMessage("Something went wrong. ❌");
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Contact Us - YourAppName</title>
        <meta name="description" content="Get in touch with us for any inquiries or support." />
      </Head>

      <div className={classes.contactContainer}>
        <h1 className={classes.contactTitle}>Contact Us</h1>
        <p className={classes.contactSubtitle}>Have a question? Feel free to reach out!</p>

        <form onSubmit={handleSubmit} className={classes.contactForm}>
          <div className={classes.formGroup}>
            <label className={classes.formLabel}>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className={classes.formInput} />
          </div>

          <div className={classes.formGroup}>
            <label className={classes.formLabel}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className={classes.formInput} />
          </div>

          <div className={classes.formGroup}>
            <label className={classes.formLabel}>Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} required className={classes.formTextarea} />
          </div>

          <button type="submit" className={classes.submitButton} disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>

          {responseMessage && <p className={classes.responseMessage}>{responseMessage}</p>}
        </form>
      </div>
    </>
  );
}
