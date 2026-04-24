import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaGem,
  FaLock,
  FaCookieBite,
  FaQuestionCircle,
  FaFileContract,
  FaInstagram,
} from "react-icons/fa";
import { useUI } from "../../context/UIContext";
import { gaEvent } from "../../lib/gtag"; // <-- ADDED
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

    // ANALYTICS: Footer impression
    gaEvent("footer_view");

    // ANOMALY: Key event for baseline
    gaEvent("key_footer_loaded");

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSection = (section) => {
    gaEvent("footer_section_toggle", { section });
    gaEvent("key_footer_section_toggle", { section }); // <-- ADD
    setActiveSection(activeSection === section ? null : section);
  };

  const handleOpenChat = () => {
    gaEvent("footer_ai_click"); // <-- ANALYTIC
    gaEvent("key_footer_ai_click");
    setIsModalOpen(true);
    openChat();
  };

  const handleFooterLinkClick = (label) => {
    gaEvent("footer_link_click", { label });
    gaEvent("key_footer_link_click", { label }); // <-- ADD
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
            <li>
              <Link
                href="/about"
                className={classes.link}
                onClick={() => handleFooterLinkClick("about")}
              >
                About Us
              </Link>
            </li>

            <li>
    
              <Link
                href="/blog"
                className={classes.link}
                onClick={() => handleFooterLinkClick("blog")}
              >
                Blog
              </Link>
            </li>

            <div className={classes.contactRow}>
              <a
                href="mailto:info@wellnesspurelife.com"
                className={classes.link}
                onClick={() => handleFooterLinkClick("email_info")}
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
                  onClick={() => handleFooterLinkClick("mindful_nourishment")}
                >
                  Mindful Nourishment
                </Link>
              </li>

              <li>
                <Link
                  href="/nourish/targeted-nutrition-vitamins-and-minerals-for-specific-needs"
                  className={classes.link}
                  onClick={() => handleFooterLinkClick("targeted_nutrition")}
                >
                  Targeted Nutrition
                </Link>
              </li>

              <li>
                <Link
                  href="/nourish/nourish-focus-discover-the-secrets-to-vibrant-living"
                  className={classes.link}
                  onClick={() => handleFooterLinkClick("focus_balance")}
                >
                  Focus & Balance
                </Link>
              </li>

              <li>
                <Link
                  href="/nourish/top-picks-for-nourishment-curated-guides-and-tips"
                  className={classes.link}
                  onClick={() => handleFooterLinkClick("curated_mindful_tips")}
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
                  onClick={() => handleFooterLinkClick("superfood_benefits")}
                >
                  Superfood Benefits
                </Link>
              </li>

              <li>
                <Link
                  href="/nourish/boost-your-diet"
                  className={classes.link}
                  onClick={() => handleFooterLinkClick("boost_diet")}
                >
                  Boost Your Diet
                </Link>
              </li>

              <li>
                <Link
                  href="/nourish/powerful-ingredients"
                  className={classes.link}
                  onClick={() => handleFooterLinkClick("powerful_ingredients")}
                >
                  Powerful Ingredients
                </Link>
              </li>

              <li>
                <Link
                  href="/nourish/eating-with-intention-a-guide-to-mindful-nourishment"
                  className={classes.link}
                  onClick={() => handleFooterLinkClick("mindful_nourishment")}
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
                  onClick={() => handleFooterLinkClick("full_body_sculpt")}
                >
                  Full Body Sculpt
                </Link>
              </li>

              <li>
                <Link
                  href="/fitness/effective-core-exercises-for-fitness-enthusiasts"
                  className={classes.link}
                  onClick={() => handleFooterLinkClick("core_power_exercises")}
                >
                  Core Power Exercises
                </Link>
              </li>

              <li>
                <Link
                  href="/fitness/treadmill-vs-outdoor-running-weighing-the-options"
                  className={classes.link}
                  onClick={() => handleFooterLinkClick("treadmill_vs_outdoor")}
                >
                  Treadmill vs Outdoor
                </Link>
              </li>

              <li>
                <Link
                  href="/fitness/exploring-the-8-limbs-of-yoga-for-a-holistic-understanding"
                  className={classes.link}
                  onClick={() => handleFooterLinkClick("8_limbs_yoga")}
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
                <Link
                  href="/upgrade"
                  className={classes.link}
                  onClick={() =>
                    handleFooterLinkClick("upgrade_premium_footer")
                  }
                >
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
                <Link
                  href="/contact"
                  className={classes.link}
                  onClick={() => handleFooterLinkClick("contact")}
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <FaLock className={classes.icon} />
                <Link
                  href="/privacy-policy"
                  className={classes.link}
                  onClick={() => handleFooterLinkClick("privacy_policy")}
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <FaCookieBite className={classes.icon} />
                <Link
                  href="/cookie-policy"
                  className={classes.link}
                  onClick={() => handleFooterLinkClick("cookie_policy")}
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <FaFileContract className={classes.icon} />
                <Link
                  href="/terms"
                  className={classes.link}
                  onClick={() => handleFooterLinkClick("terms")}
                >
                  Terms of Service
                </Link>
              </li>

              <li>
                <FaQuestionCircle className={classes.icon} />
                <Link
                  href="/faq"
                  className={classes.link}
                  onClick={() => handleFooterLinkClick("faq")}
                >
                  FAQs
                </Link>
              </li>

              <li>
                <FaCookieBite className={classes.icon} />
                <span
                  onClick={() => {
                    handleFooterLinkClick("change_cookie");
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
                  <button
                    onClick={() => {
                      gaEvent("footer_ai_click_mobile");
                      gaEvent("key_footer_ai_click_mobile");
                      openChat();
                    }}
                    className={classes.footerLink}
                  >
                    🤖 <strong>AI Wellness Assistant</strong>
                  </button>
                </li>
              </ul>
            </section>
          )}
        </div>

        <div className={classes.footerBottom}>
          <a
            href="https://www.instagram.com/wellness.pure.life"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.instagramLink}
            onClick={() => gaEvent("footer_instagram_click")}
            aria-label="Follow us on Instagram"
          >
            <FaInstagram className={classes.instagramIcon} />
            <span>@wellness.pure.life</span>
          </a>
          <div className={classes.copyright}>
            © {new Date().getFullYear()} WellnessPureLife. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}