import Link from "next/link";
import {
  FaEnvelope,
  FaBrain,
  FaAppleAlt,
  FaDumbbell,
  FaGem,
  FaRobot,
  FaLock,
  FaCookieBite,
  FaQuestionCircle,
} from "react-icons/fa";
import { useUI } from "../../context/UIContext";
import classes from "./footer.module.css";

export default function Footer() {
  const { openChat } = useUI();

  return (
    <footer className={classes.footer}>
      <div className={classes.footerContent}>
        {/* About */}
        <section className={classes.footerSection}>
          <h3>About</h3>
          <p className={classes.description}>
            WellnessPureLife helps you thrive through balance in body and mind
            using personalized tools.
          </p>
          <div className={classes.contactRow}>
            <a href="mailto:info@wellnesspurelife.com" className={classes.link}>
              info@wellnesspurelife.com
            </a>
          </div>
        </section>

        {/* Mindfulness */}
        <div className={classes.footerSection}>
          <h3>🧘 Mindfulness</h3>
          <ul className={classes.linkList}>
            <li>
              <Link
                href="/nourish/eating-with-intention-a-guide-to-mindful-nourishment"
                className={classes.link}
              >
                Mindful Nourishment
              </Link>
            </li>
            <li>
              <Link
                href="/nourish/targeted-nutrition-vitamins-and-minerals-for-specific-needs"
                className={classes.link}
              >
                Targeted Nutrition
              </Link>
            </li>
            <li>
              <Link
                href="/nourish/nourish-focus-discover-the-secrets-to-vibrant-living"
                className={classes.link}
              >
                Focus & Balance
              </Link>
            </li>
            <li>
              <Link
                href="/nourish/top-picks-for-nourishment-curated-guides-and-tips"
                className={classes.link}
              >
                Curated Mindful Tips
              </Link>
            </li>
          </ul>
        </div>

        {/* Nourish */}
        <div className={classes.footerSection}>
          <h3>🍎 Nourish</h3>
          <ul className={classes.linkList}>
            <li>
              <Link href="/nourish/superfood-benefits" className={classes.link}>
                Superfood Benefits
              </Link>
            </li>
            <li>
              <Link href="/nourish/boost-your-diet" className={classes.link}>
                Boost Your Diet
              </Link>
            </li>
            <li>
              <Link
                href="/nourish/powerful-ingredients"
                className={classes.link}
              >
                Powerful Ingredients
              </Link>
            </li>
            <li>
              <Link
                href="/nourish/eating-with-intention-a-guide-to-mindful-nourishment"
                className={classes.link}
              >
                Mindful Nourishment
              </Link>
            </li>
          </ul>
        </div>

        {/* Fitness */}
        <div className={classes.footerSection}>
          <h3>🏋️ Fitness</h3>
          <ul className={classes.linkList}>
            <li>
              <Link
                href="/fitness/workouts-for-sculpting-every-inch-of-your-body"
                className={classes.link}
              >
                Full Body Sculpt
              </Link>
            </li>
            <li>
              <Link
                href="/fitness/effective-core-exercises-for-fitness-enthusiasts"
                className={classes.link}
              >
                Core Power Exercises
              </Link>
            </li>
            <li>
              <Link
                href="/fitness/treadmill-vs-outdoor-running-weighing-the-options"
                className={classes.link}
              >
                Treadmill vs Outdoor
              </Link>
            </li>
            <li>
              <Link
                href="/fitness/exploring-the-8-limbs-of-yoga-for-a-holistic-understanding"
                className={classes.link}
              >
                8 Limbs of Yoga
              </Link>
            </li>
          </ul>
        </div>

        {/* Premium Tools */}
        <section className={classes.footerSection}>
          <h3>Premium Tools</h3>
          <ul className={classes.linkList}>
            <li>
              <FaGem className={classes.icon} />
              <Link href="/upgrade" className={classes.link}>
                Upgrade to Premium
              </Link>
            </li>
            <li>
              <button onClick={openChat} className={classes.footerLink}>
                <span className={classes.footerIcon}>🤖</span>
                <div className={classes.linkText}>
                  <strong>AI</strong> Wellness Assistant
                  <small className={classes.caption}>
                    Chat 24/7 with our AI expert
                  </small>
                </div>
              </button>
            </li>
          </ul>
        </section>

        {/* Support */}
        <section className={classes.footerSection}>
          <h3>Support</h3>
          <ul className={classes.linkList}>
            <li>
              <FaEnvelope className={classes.icon} />
              <Link href="/contact" className={classes.link}>
                Contact Us
              </Link>
            </li>
            <li>
              <FaLock className={classes.icon} />
              <Link href="/privacy-policy" className={classes.link}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <FaCookieBite className={classes.icon} />
              <Link href="/cookie-policy" className={classes.link}>
                Cookie Policy
              </Link>
            </li>
            <li>
              <FaQuestionCircle className={classes.icon} />
              <Link href="/faq" className={classes.link}>
                FAQs
              </Link>
            </li>
            <li>
              <FaCookieBite className={classes.icon} />
              <span
                onClick={() => {
                  localStorage.removeItem("cookieConsent");
                  window.location.reload();
                }}
                className={classes.link}
                style={{ cursor: "pointer" }}
              >
                Change Cookie Settings
              </span>
            </li>
          </ul>
        </section>
      </div>
      <div className={classes.footerBottom}>
        © {new Date().getFullYear()} WellnessPureLife. All rights reserved.
      </div>
    </footer>
  );
}
