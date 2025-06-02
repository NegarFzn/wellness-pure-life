import classes from "./faqItem.module.css";

const FAQItem = ({ question, answer }) => {
  return (
    <div className={classes.faqItem}>
      <h4 className={classes.faqQuestion}>{question}</h4>
      <p className={classes.faqAnswer}>{answer}</p>
    </div>
  );
};

export default FAQItem;
