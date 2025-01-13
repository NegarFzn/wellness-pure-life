import Link from "next/link";
import classes from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={classes.footer}>
      <div className={classes.footerContent}>
        <div>
          <h3>Contact Us</h3>
          <p>Email: example@example.com</p>
          <p>Phone: 123-456-7890</p>
        </div>
        <div>
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
        <div>
          <h3>Follow Us</h3>
          <ul className={classes.listContainer}>
            <li>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.link}
              >
                Instagram
              </Link>
            </li>
            <li>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.link}
              >
                LinkedIn
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={classes.footerBottom}>
        <p>&copy; {currentYear} Your Website Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
