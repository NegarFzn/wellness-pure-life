import Link from "next/link";
import classes from "./Footer.module.css";
import { FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa"; // ✅ Added icons

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={classes.footer}>
      <div className={classes.footerContent}>
        {/* Contact Info */}
        <div className={classes.footerSection}>
          <h3>Contact Us</h3>
          <p>
            <FaEnvelope className={classes.icon} /> example@example.com
          </p>
          <p>
            <FaPhone className={classes.icon} /> 123-456-7890
          </p>
        </div>

        {/* Quick Links */}
        <div className={classes.footerSection}>
          <h3>Quick Links</h3>
          <ul className={classes.listContainer}>
            <li>
              <Link href="/" className={classes.link}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className={classes.link}>
                Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className={classes.link}>
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className={classes.footerSection}>
          <h3>Follow Us</h3>
          <ul className={classes.listContainer}>
            <li>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.link}
              >
                <FaInstagram className={classes.icon} /> Instagram
              </Link>
            </li>
            <li>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.link}
              >
                <FaLinkedin className={classes.icon} /> LinkedIn
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={classes.footerBottom}>
        <p>&copy; {currentYear} Your Website Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
