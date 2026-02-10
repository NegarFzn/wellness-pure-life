import { useEffect, useState } from "react";
import Link from "next/link";
import { gaEvent } from "../../lib/gtag";  // ⭐ REQUIRED
import classes from "./CookieConsent.module.css";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookieConsent");
      if (!consent) {
        setVisible(true);
        gaEvent("cookie_banner_shown");
        gaEvent("key_cookie_banner_shown");
        return;
      }

      const { timestamp } = JSON.parse(consent);
      const oneYear = 365 * 24 * 60 * 60 * 1000;

      if (Date.now() - timestamp > oneYear) {
        setVisible(true);
        gaEvent("cookie_banner_shown");
        gaEvent("key_cookie_banner_shown");
      }
    } catch {
      setVisible(true);
      gaEvent("cookie_banner_shown");
      gaEvent("key_cookie_banner_shown");
    }
  }, []);

  const setConsent = (type) => {
    const data = {
      type,
      timestamp: Date.now(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(data));

    // ⭐ REQUIRED FOR GA4 + ANOMALY DETECTION
    gaEvent("cookie_consent_given", { type });
    gaEvent("key_cookie_consent_given", { type });

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
          onClick={() => {
            gaEvent("cookie_consent_click_essential");
            gaEvent("key_cookie_consent_click_essential");
            setConsent("essential");
          }}
          className={classes.manage}
        >
          Use Essential Only
        </button>

        <button
          onClick={() => {
            gaEvent("cookie_consent_click_all");
            gaEvent("key_cookie_consent_click_all");
            setConsent("all");
          }}
          className={classes.accept}
        >
          Accept All
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
