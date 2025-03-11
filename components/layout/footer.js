import Link from "next/link";
import classes from "./Footer.module.css";
import {
  FaHome,
  FaBrain,
  FaAppleAlt,
  FaDumbbell,
  FaLock,
  FaCookieBite,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={classes.footer}>
      <div className={classes.footerContent}>
        {/* ✅ Contact Info Section */}
        <div className={classes.footerSection}>
          <h3>Contact Us</h3>
          <ul className={classes.listContainer}>
            <li>
              <FaEnvelope className={classes.icon} />
              <Link href="mailto:info@wellnesspurelife.com">
                info@wellnesspurelife.com
              </Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* ✅ Quick Links Section */}
        <div className={classes.footerSection}>
          <h3>Quick Links</h3>
          <ul className={classes.listContainer}>
            <li>
              <Link href="/" className={classes.link}>
                <FaHome className={classes.icon} /> Home
              </Link>
            </li>
            <li>
              <Link href="/mindfulness" className={classes.link}>
                <FaBrain className={classes.icon} /> Mind & Calm
              </Link>
            </li>
            <li>
              <Link href="/nourish" className={classes.link}>
                <FaAppleAlt className={classes.icon} /> Healthy Eating
              </Link>
            </li>
            <li>
              <Link href="/fitness" className={classes.link}>
                <FaDumbbell className={classes.icon} /> Fitness & Wellness
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className={classes.link}>
                <FaLock className={classes.icon} /> Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/cookie-policy" className={classes.link}>
                <FaCookieBite className={classes.icon} /> Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* ✅ Footer Bottom Section */}
      <div className={classes.footerBottom}>
        <p>
          &copy; {new Date().getFullYear()} WellnessPureLife. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
