import { useState } from "react";
import Link from "next/link";
import classes from "./header.module.css";

export default function MobileNav({
  topicsMap,
  navItems,
  closeMenu,
  weather,
  nyTime,
}) {
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

          <li>
            <Link
              href="/news"
              className={classes.mobileNavLink}
              onClick={closeMenu}
            >
              News
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={classes.mobileNavLink}
              onClick={closeMenu}
            >
              Contact
            </Link>
          </li>

          <li className={classes.mobileWeather}>
            {weather ? (
              <>
                <img
                  src={weather.current.condition.icon}
                  alt="Weather icon"
                  className={classes.weatherIcon}
                />
                <div className={classes.weatherText}>
                  <div className={classes.weatherTemp}>
                    {weather.current.temp_c}°C
                  </div>
                  <div className={classes.weatherTime}>{nyTime} (NY)</div>
                </div>
              </>
            ) : (
              <div className={classes.weatherText}>Loading...</div>
            )}
          </li>
        </ul>
      ) : (
        <div className={classes.mobileSublist}>
          <button
            className={classes.backButton}
            onClick={() => setActiveMobileSection(null)}
          >
            ‹ Back
          </button>
          <ul>
            <li>
              <Link
                href={`/${activeMobileSection.toLowerCase()}`}
                className={classes.mainSectionLink}
                onClick={() => {
                  setActiveMobileSection(null);
                  closeMenu();
                }}
              >
                {activeMobileSection}
              </Link>
            </li>
            {(topicsMap[activeMobileSection] || []).map((item, i) => (
              <li key={i}>
                <Link
                  href={item.href}
                  className={classes.mobileNavLink}
                  onClick={() => {
                    setActiveMobileSection(null);
                    closeMenu();
                  }}
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
