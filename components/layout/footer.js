import Link from "next/link";
import classes from "./Footer.module.css";
import { FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa"; // ✅ Added icons

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
              <Link href="/" legacyBehavior>
                <a className={classes.link}>Home</a>
              </Link>
            </li>
            <li>
              <Link href="/mindfulness" legacyBehavior>
                <a className={classes.link}>Mindfulness</a>
              </Link>
            </li>
            <li>
              <Link href="/nourish" legacyBehavior>
                <a className={classes.link}>Nourishment</a>
              </Link>
            </li>
            <li>
              <Link href="/fitness" legacyBehavior>
                <a className={classes.link}>Body Health</a>
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
