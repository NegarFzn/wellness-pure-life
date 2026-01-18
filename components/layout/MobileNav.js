"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gaEvent } from "../../lib/gtag";
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
    gaEvent("mobile_nav_surprise_click", {
      section: activeMobileSection,
    });

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
                onClick={() => {
                  gaEvent("mobile_nav_section_open", { label });
                  setActiveMobileSection(label);
                }}
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
                onClick={() => {
                  gaEvent("mobile_nav_link_click", { item });
                  closeMenu();
                }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            </li>
          ))}

          <li>
            <Link
              href="/premium"
              className={classes.mobileNavLink}
              onClick={() => {
                gaEvent("mobile_nav_premium_click");
                closeMenu();
              }}
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
                  onClick={() =>
                    gaEvent("mobile_nav_weather_click", {
                      temp: weather.current.temp_c,
                    })
                  }
                />
                <div
                  className={classes.weatherText}
                  onClick={() =>
                    gaEvent("mobile_nav_weather_click", {
                      temp: weather.current.temp_c,
                    })
                  }
                >
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
            onClick={() => {
              gaEvent("mobile_nav_back_click", {
                from: activeMobileSection,
              });
              setActiveMobileSection(null);
            }}
          >
            ‹ Back
          </button>

          <ul>
            <li>
              <Link
                href={`/${activeMobileSection.toLowerCase()}`}
                className={classes.mainSectionLink}
                onClick={() => {
                  gaEvent("mobile_nav_section_main_click", {
                    section: activeMobileSection,
                  });
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
                    gaEvent("mobile_nav_topic_click", {
                      section: activeMobileSection,
                      topic: item.text,
                    });
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
                    onClick={() => {
                      gaEvent("mobile_nav_challenge_click");
                      closeMenu();
                    }}
                  >
                    Start Challenge →
                  </Link>
                ) : (
                  <>
                    <div>Available for Premium members.</div>
                    <Link
                      href="/premium"
                      className={classes.premiumLink}
                      onClick={() => {
                        gaEvent("mobile_nav_challenge_upgrade_click");
                        closeMenu();
                      }}
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
