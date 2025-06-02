import { useEffect, useState } from "react";
import Link from "next/link";
import classes from "./CookieConsent.module.css";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookieConsent");
      if (!consent) return setVisible(true);

      const { timestamp } = JSON.parse(consent);
      const oneYear = 365 * 24 * 60 * 60 * 1000;

      if (Date.now() - timestamp > oneYear) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const setConsent = (type) => {
    const data = {
      type,
      timestamp: Date.now(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(data));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={classes.banner}>
      <p>
        We use cookies to enhance your experience and deliver personalized ads.{" "}
        <Link href="/cookie-policy" className={classes.link}>
          Learn more
        </Link>
      </p>
      <div className={classes.actions}>
        <button
          onClick={() => setConsent("essential")}
          className={classes.manage}
        >
          Use Essential Only
        </button>
        <button onClick={() => setConsent("all")} className={classes.accept}>
          Accept All
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
