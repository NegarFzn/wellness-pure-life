"use client";

import { useState, useEffect } from "react";
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
  isVerified,
}) {
  const [activeMobileSection, setActiveMobileSection] = useState(null);
  const router = useRouter();

  // ⭐ Track mobile navigation open
  useEffect(() => {
    gaEvent("mobile_nav_open");
    gaEvent("key_mobile_nav_open");
  }, []);

  const normalize = (label) =>
    label?.charAt(0).toUpperCase() + label?.slice(1).toLowerCase();

  const handleSurprise = () => {
    const key = normalize(activeMobileSection);
    const topics = topicsMap[key] || [];

    gaEvent("mobile_nav_surprise_click", { section: key });
    gaEvent("key_mobile_nav_surprise_click", { section: key });

    if (topics.length) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      if (randomTopic?.href) router.push(randomTopic.href);
    }

    closeMenu();
    setActiveMobileSection(null);
  };

  return (
    <nav className={classes.mobileNav} aria-label="Mobile navigation">
      {!activeMobileSection ? (
        <>
          {/* ===========================
              PRIMARY CTA BUTTON GROUP
          ============================== */}
          <ul className={classes.ctaGroupMobile}>
            <li>
              <Link
                href="/quizzes/quiz-main"
                className={classes.mobileCtaButton}
                onClick={() => {
                  gaEvent("mobile_nav_start_quiz_click");
                       gaEvent("key_mobile_nav_start_quiz_click");
                  closeMenu();
                }}
              >
                Start Quiz →
              </Link>
            </li>

            <li>
              <Link
                href="/plan/weekly-plan"
                className={classes.mobileCtaButtonSecondary}
                onClick={() => {
                  gaEvent("mobile_nav_weekly_plan_click");
                  gaEvent("key_mobile_nav_weekly_plan_click");
                  closeMenu();
                }}
              >
                Weekly Plan
              </Link>
            </li>

            <li>
              <Link
                href="/plan/daily-routine"
                className={classes.mobileCtaButtonSecondary}
                onClick={() => {
                  gaEvent("mobile_nav_daily_routine_click");
                  gaEvent("key_mobile_nav_daily_routine_click");
                  closeMenu();
                }}
              >
                Daily Routine
              </Link>
            </li>

            <li>
              <Link
                href="/challenges"
                className={classes.mobileCtaButtonSecondary}
                onClick={() => {
                  gaEvent("mobile_nav_challenges_click");
                  gaEvent("key_mobile_nav_challenges_click");
                  closeMenu();
                }}
              >
                Challenges
              </Link>
            </li>

            {/* PREMIUM IN CTA GROUP (not nav list) */}
            <li>
              <Link
                href="/premium"
                className={classes.mobileCtaButtonPremium}
                onClick={() => {
                  gaEvent("mobile_nav_premium_click");
                  gaEvent("key_mobile_nav_premium_click");
                  closeMenu();
                }}
              >
                Premium
              </Link>
            </li>
          </ul>

          {/* ===========================
              MAIN NAVIGATION LIST
          ============================== */}
          <ul className={classes.topLevelNav}>
            {navItems.map((label) => (
              <li key={label}>
                <button
                  type="button"
                  className={classes.navButton}
                  onClick={() => {
                    const normalized = normalize(label);
                    gaEvent("mobile_nav_section_open", { label: normalized });
                    gaEvent("key_mobile_nav_section_open", {
                      label: normalized,
                    });
                    setActiveMobileSection(label);
                  }}
                >
                  {label}
                  <span className={classes.arrow}>›</span>
                </button>
              </li>
            ))}

            {/* Blog, News, Contact */}
            {["blog", "news", "contact"].map((item) => (
              <li key={item}>
                <Link
                  href={`/${item}`}
                  className={classes.mobileNavLink}
                  onClick={() => {
                    gaEvent("mobile_nav_link_click", { item });
                    gaEvent("key_mobile_nav_link_click", { item });
                    closeMenu();
                  }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              </li>
            ))}

            {/* WEATHER */}
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
        </>
      ) : (
        /* ===========================
           SUB-MENU SECTION
        ============================== */
        <div className={classes.mobileSublist}>
          <button
            type="button"
            className={classes.backButton}
            onClick={() => {
              gaEvent("mobile_nav_back_click", {
                from: normalize(activeMobileSection),
              });
              gaEvent("key_mobile_nav_back_click", {
                from: normalize(activeMobileSection),
              });
              setActiveMobileSection(null);
            }}
          >
            ‹ Back
          </button>

          <ul>
            {/* Main link */}
            <li>
              <Link
                href={`/${normalize(activeMobileSection).toLowerCase()}`}
                className={classes.mainSectionLink}
                onClick={() => {
                  gaEvent("mobile_nav_section_main_click", {
                    section: normalize(activeMobileSection),
                  });
                  gaEvent("key_mobile_nav_section_main_click", {
                    section: normalize(activeMobileSection),
                  });
                  setActiveMobileSection(null);
                  closeMenu();
                }}
              >
                {normalize(activeMobileSection)}
              </Link>
            </li>

            {/* Topics list */}
            {(topicsMap[normalize(activeMobileSection)] || []).map(
              (item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className={classes.mobileNavLink}
                    onClick={() => {
                      gaEvent("mobile_nav_topic_click", {
                        section: normalize(activeMobileSection),
                        topic: item.text,
                      });
                      gaEvent("key_mobile_nav_topic_click", {
                        section: normalize(activeMobileSection),
                        topic: item.text,
                      });
                      setActiveMobileSection(null);
                      closeMenu();
                    }}
                  >
                    {item.text}
                  </Link>
                </li>
              ),
            )}

            {/* Surprise Me */}
            <li>
              <button
                type="button"
                className={classes.surpriseButton}
                onClick={handleSurprise}
              >
                Surprise Me
              </button>
            </li>

            {/* Premium Challenge Box */}
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
                      gaEvent("key_mobile_nav_challenge_click");
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
                        gaEvent("key_mobile_nav_challenge_upgrade_click");
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
