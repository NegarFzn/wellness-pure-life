import FAQItem from "../components/FAQItem/FAQItem";

const FAQPage = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem" }}>
        Frequently Asked Questions
      </h2>

      <FAQItem
        question="How do I create an account?"
        answer="Click on the Sign Up button at the top-right corner and enter your email and password to get started."
      />
      <FAQItem
        question="What features are included in Premium?"
        answer="Premium includes guided meditations, personalized meal plans, and access to the AI Wellness Assistant."
      />
      <FAQItem
        question="How do I use the AI Wellness Assistant?"
        answer="Once you're a premium user, open the assistant from the bottom corner chat launcher and start asking questions."
      />
      <FAQItem
        question="Is my data safe?"
        answer="Yes, we take data privacy seriously and follow industry standards to protect your information."
      />
    </div>
  );
};

export default FAQPage;
