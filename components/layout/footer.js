import Link from "next/link";
import classes from "./footer.module.css";
import {
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaBrain,
  FaAppleAlt,
  FaDumbbell,
  FaLock,
  FaCookieBite,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footerContent}>
        {/* ✅ Contact Section */}
        <div className={classes.footerSection}>
          <h3>Contact Us</h3>
          <div className={classes.contactInfo}>
            <FaEnvelope className={classes.icon} />
            <Link
              href="mailto:info@wellnesspurelife.com"
              className={classes.link}
            >
              info@wellnesspurelife.com
            </Link>
          </div>
          <Link href="/contact" className={classes.link}>
            Contact Us
          </Link>
        </div>

        {/* ✅ Quick Links Section */}
        <div className={classes.footerSection}>
          <h3>Quick Links</h3>
          <ul className={classes.listContainer}>
            <li>
              <FaHome className={classes.icon} />
              <Link href="/">Home</Link>
            </li>
            <li>
              <FaBrain className={classes.icon} />
              <Link href="/mindfulness">Mind & Calm</Link>
            </li>
            <li>
              <FaAppleAlt className={classes.icon} />
              <Link href="/nourish">Healthy Eating</Link>
            </li>
            <li>
              <FaDumbbell className={classes.icon} />
              <Link href="/fitness">Fitness & Wellness</Link>
            </li>
            <li>
              <FaLock className={classes.icon} />
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <FaCookieBite className={classes.icon} />
              <Link href="/cookie-policy">Cookie Policy</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* ✅ Footer Bottom Section */}
      <div className={classes.footerBottom}>
        <p>
          © {new Date().getFullYear()} WellnessPureLife. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
