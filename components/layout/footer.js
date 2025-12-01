import Link from "next/link";
import { useState, useEffect } from "react";
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
  const [activeSection, setActiveSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleOpenChat = () => {
    // simulate showing a premium modal instead of chat directly
    setIsModalOpen(true);
    openChat();
  };

  return (
    <>
      <footer className={classes.footer}>
        <div className={classes.footerContent}>
          {/* About */}
          <section
            className={`${classes.footerSection} ${
              activeSection === "about" ? classes.active : ""
            }`}
          >
            <h3 onClick={() => toggleSection("about")}>About</h3>
            <p className={classes.description}>
              WellnessPureLife helps you thrive through balance in body and mind
              using personalized tools.
            </p>
            <div className={classes.contactRow}>
              <a
                href="mailto:info@wellnesspurelife.com"
                className={classes.link}
              >
                info@wellnesspurelife.com
              </a>
            </div>
          </section>

          {/* Mindfulness */}
          <section
            className={`${classes.footerSection} ${
              activeSection === "mindfulness" ? classes.active : ""
            }`}
          >
            <h3 onClick={() => toggleSection("mindfulness")}>🧘 Mindfulness</h3>
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
          </section>

          {/* Nourish */}
          <section
            className={`${classes.footerSection} ${
              activeSection === "nourish" ? classes.active : ""
            }`}
          >
            <h3 onClick={() => toggleSection("nourish")}>🍎 Nourish</h3>
            <ul className={classes.linkList}>
              <li>
                <Link
                  href="/nourish/superfood-benefits"
                  className={classes.link}
                >
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
          </section>

          {/* Fitness */}
          <section
            className={`${classes.footerSection} ${
              activeSection === "fitness" ? classes.active : ""
            }`}
          >
            <h3 onClick={() => toggleSection("fitness")}>🏋️ Fitness</h3>
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
          </section>

          {/* Premium Tools */}
          <section
            className={`${classes.footerSection} ${
              activeSection === "premium" ? classes.active : ""
            }`}
          >
            <h3 onClick={() => toggleSection("premium")}>Premium Tools</h3>
            <ul className={classes.linkList}>
              <li>
                <FaGem className={classes.icon} />
                <Link href="/upgrade" className={classes.link}>
                  Upgrade to Premium
                </Link>
              </li>
              <li>
                <button onClick={handleOpenChat} className={classes.footerLink}>
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
          <section
            className={`${classes.footerSection} ${
              activeSection === "support" ? classes.active : ""
            }`}
          >
            <h3 onClick={() => toggleSection("support")}>Support</h3>
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
                <FaQuestionCircle className={classes.icon} />
                <Link href="/blog" className={classes.link}>
                  Blog
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
          {isMobile && (
            <section
              className={`${classes.footerSection} ${classes.footerAISection}`}
            >
              <ul className={classes.linkList}>
                <li>
                  <button onClick={openChat} className={classes.footerLink}>
                    🤖 <strong>AI Wellness Assistant</strong>
                  </button>
                </li>
              </ul>
            </section>
          )}
        </div>
        <div className={classes.footerBottom}>
          © {new Date().getFullYear()} WellnessPureLife. All rights reserved.
        </div>
      </footer>
    </>
  );
}
