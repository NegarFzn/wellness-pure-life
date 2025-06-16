import { useState } from "react";
import Link from "next/link";
import classes from "./header.module.css";

export default function MobileNav({ topicsMap, navItems, closeMenu }) {
  const [activeMobileSection, setActiveMobileSection] = useState(null);

  return (
    <nav className={classes.mobileNav}>
      {!activeMobileSection ? (
        <ul className={classes.topLevelNav}>
          {navItems.map((label) => (
            <li key={label}>
              <button
                className={classes.navButton}
                onClick={() => setActiveMobileSection(label)}
              >
                {label}
                <span className={classes.arrow}>›</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className={classes.mobileSublist}>
          <button
            className={classes.backButton}
            onClick={() => setActiveMobileSection(null)}
          >
            ‹ Back
          </button>
          <h4 className={classes.sublistTitle}>{activeMobileSection}</h4>
          <ul>
            {(topicsMap[activeMobileSection] || []).map((item, i) => (
              <li key={i}>
                <Link
                  href={item.href}
                  onClick={() => {
                    setActiveMobileSection(null);
                    closeMenu();
                  }}
                  className={classes.mobileNavLink}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
