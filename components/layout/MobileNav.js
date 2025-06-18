import { useState } from "react";
import Link from "next/link";
import classes from "./header.module.css";

export default function MobileNav({
  topicsMap,
  navItems,
  closeMenu,
  weather,
  nyTime,
  user,
}) {
  const [activeMobileSection, setActiveMobileSection] = useState(null);

  const handleSurprise = () => {
    const topics = topicsMap[activeMobileSection] || [];
    if (topics.length > 0) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      if (randomTopic) {
        window.location.href = randomTopic.href;
      }
    }
    setActiveMobileSection(null);
    closeMenu();
  };

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
            <li>
              <Link
                href={`/${activeMobileSection.toLowerCase()}`}
                className={classes.mobileNavLink}
                onClick={() => {
                  setActiveMobileSection(null);
                  closeMenu();
                }}
              >
                Browse all {activeMobileSection.toLowerCase()} topics →
              </Link>
            </li>
            <li>
              <button
                className={classes.surpriseButton}
                onClick={handleSurprise}
              >
                Surprise Me
              </button>
              <li className={classes.premiumBox}>
                <div className={classes.premiumInner}>
                  <div>
                    <span role="img" aria-label="fire">
                      🔥
                    </span>{" "}
                    <strong>7-Day Challenge</strong>
                  </div>
                  {user?.isPremium ? (
                    <Link
                      href="/challenge"
                      className={classes.premiumActiveLink}
                      onClick={() => {
                        setActiveMobileSection(null);
                        closeMenu();
                      }}
                    >
                      Start Challenge →
                    </Link>
                  ) : (
                    <>
                      <div>
                        This challenge is available for Premium members.
                      </div>
                      <Link
                        href="/upgrade"
                        className={classes.premiumLink}
                        onClick={() => {
                          setActiveMobileSection(null);
                          closeMenu();
                        }}
                      >
                        Upgrade to Premium →
                      </Link>
                    </>
                  )}
                </div>
              </li>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
