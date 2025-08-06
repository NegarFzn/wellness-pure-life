import FAQItem from "../components/FAQItem/FAQItem";

const FAQPage = () => {
  // Ad styling
  const adStyle = {
    display: "block",
    margin: "2rem 0",
    textAlign: "center",
    minHeight: "100px",
  };

  // Page wrapper styling
  const wrapperStyle = {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "1rem",
  };

  // Header styling
  const headerStyle = {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "2rem",
  };

  return (
    <div style={wrapperStyle}>
      {/* Top Ad */}
      {/*  <div style={adStyle}>
        <AdBlock adSlot="1234567890" />
      </div> */}
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
      {/* Bottom Ad */}
      {/* <div style={adStyle}>
        <AdBlock adSlot="2345678901" />
      </div> */}
    </div>
  );
};

export default FAQPage;
