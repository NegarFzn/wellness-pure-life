import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import classes from "./index.module.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const router = useRouter();

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

        setTimeout(() => {
          router.push("/"); // ✅ Redirect after 1.5 seconds
        }, 1500);
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
        <title>Contact Us | Wellness Pure Life</title>
        <meta
          name="description"
          content="Reach out to Wellness Pure Life with your questions, feedback, or collaboration requests. We're here to help you on your wellness journey."
        />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wellness Pure Life" />
        <meta property="og:title" content="Contact Us | Wellness Pure Life" />
        <meta
          property="og:description"
          content="Reach out to Wellness Pure Life with your questions, feedback, or collaboration requests. We're here to help you on your wellness journey."
        />
        <meta
          property="og:image"
          content="https://wellnesspurelife.com/images/social-card.jpg"
        />
        <meta
          property="og:url"
          content="https://wellnesspurelife.com/contact"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Wellness Pure Life" />
        <meta
          name="twitter:description"
          content="We'd love to hear from you! Contact Wellness Pure Life for wellness advice, feedback, or business inquiries."
        />
        <meta
          name="twitter:image"
          content="https://wellnesspurelife.com/images/social-card.jpg"
        />

        {/* Canonical and Favicon */}
        <link rel="canonical" href="https://wellnesspurelife.com/contact" />
        <link rel="icon" href="/favicon.ico" />
        {/* JSON-LD Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://wellnesspurelife.com/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Contact",
                  item: "https://wellnesspurelife.com/contact",
                },
              ],
            }),
          }}
        />
      </Head>

      <div className={classes.contactContainer}>
        <h1 className={classes.contactTitle}>Contact Us</h1>
        <p className={classes.contactSubtitle}>
          Have a question? Feel free to reach out!
        </p>
        <form onSubmit={handleSubmit} className={classes.contactForm}>
          <div className={classes.formGroup}>
            <label htmlFor="name" className={classes.formLabel}>
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={classes.formInput}
              autoComplete="name"
              placeholder="Your full name"
            />
          </div>
          <div className={classes.formGroup}>
            <label className={classes.formLabel}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={classes.formInput}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div className={classes.formGroup}>
            <label className={classes.formLabel}>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className={classes.formTextarea}
              placeholder="How can we help?"
            />
          </div>
          <button
            type="submit"
            className={classes.submitButton}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
          {responseMessage && (
            <p className={classes.responseMessage}>{responseMessage}</p>
          )}
        </form>
      </div>
    </>
  );
}
