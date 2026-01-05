"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleSurprise = () => {
    const topics = topicsMap[activeMobileSection] || [];
    if (topics.length > 0) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      if (randomTopic?.href) {
        router.push(randomTopic.href);
      }
    }
    setActiveMobileSection(null);
    closeMenu();
  };

  return (
    <nav className={classes.mobileNav} aria-label="Mobile navigation">
      {!activeMobileSection ? (
        <ul className={classes.topLevelNav}>
          {navItems.map((label) => (
            <li key={label}>
              <button
                type="button"
                className={classes.navButton}
                onClick={() => setActiveMobileSection(label)}
                aria-expanded={activeMobileSection === label}
              >
                {label}
                <span className={classes.arrow}>›</span>
              </button>
            </li>
          ))}

          {["blog", "news", "contact"].map((item) => (
            <li key={item}>
              <Link
                href={`/${item}`}
                className={classes.mobileNavLink}
                onClick={closeMenu}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            </li>
          ))}

          <li>
            <Link
              href="/premium"
              className={classes.mobileNavLink}
              onClick={closeMenu}
            >
              Premium
            </Link>
          </li>

          <li className={classes.mobileWeather}>
            {weather ? (
              <>
                <img
                  src={weather.current.condition.icon}
                  alt={weather.current.condition.text}
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
              <div className={classes.weatherText}>Loading weather…</div>
            )}
          </li>
        </ul>
      ) : (
        <div className={classes.mobileSublist}>
          <button
            type="button"
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
              <button
                type="button"
                className={classes.surpriseButton}
                onClick={handleSurprise}
              >
                Surprise Me
              </button>
            </li>

            <li className={classes.premiumBox}>
              <div className={classes.premiumInner}>
                <div>
                  🔥 <strong>7-Day Challenge</strong>
                </div>

                {user?.isPremium ? (
                  <Link
                    href="/challenge"
                    className={classes.premiumActiveLink}
                    onClick={closeMenu}
                  >
                    Start Challenge →
                  </Link>
                ) : (
                  <>
                    <div>Available for Premium members.</div>
                    <Link
                      href="/premium"
                      className={classes.premiumLink}
                      onClick={closeMenu}
                    >
                      Upgrade to Premium →
                    </Link>
                  </>
                )}
              </div>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
