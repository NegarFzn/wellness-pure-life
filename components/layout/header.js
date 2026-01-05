import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import NavLink from "./nav-link";
import { signOut, useSession } from "next-auth/react";
import { useUI } from "../../context/UIContext";
import Signup from "../Auth/Signup";
import Login from "../Auth/Login";
import { toast } from "react-toastify";
import logoImg from "../../public/images/logo.png";
import { FiUser, FiLogOut } from "react-icons/fi";
import ChallengeBox from "./ChallengeBox";
import TopicsColumn from "./TopicsColumn";
import SpotlightColumn from "./SpotlightColumn";
import Weather from "../../components/layout/Weather";
import MobileNav from "./MobileNav";

import classes from "./header.module.css";

export default function Header({ weather }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user || null;

  const {
    openLogin,
    openSignup,
    showLogin,
    showSignup,
    closeLogin,
    closeSignup,
  } = useUI();

  const [justSignedUp, setJustSignedUp] = useState(false);
  const [resent, setResent] = useState(false);
  const [nyTime, setNyTime] = useState("");
  const [topicsMap, setTopicsMap] = useState({});
  const [spotlightsMap, setSpotlightsMap] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isVerified = !!user?.emailVerified;

  const handleDropdownToggle = (label) => {
    if (activeDropdown === label) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(label);
    }
  };

  useEffect(() => {
    const updateNYTime = () => {
      const now = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
      });
      setNyTime(now);
    };

    updateNYTime();
    const interval = setInterval(updateNYTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("justSignedUp") === "true"
    ) {
      setJustSignedUp(true);
    }

    const checkFlag = () => {
      if (localStorage.getItem("justSignedUp") === "true") {
        setJustSignedUp(true);
      }
    };

    window.addEventListener("storage", checkFlag);
    return () => window.removeEventListener("storage", checkFlag);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.removeItem("justSignedUp");
      setJustSignedUp(false);
    }
  }, [user]);

  const handleSignupComplete = () => {
    setJustSignedUp(true);
  };

  const handleLoginSuccess = () => {
    closeLogin();
  };

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const res = await fetch("/api/navdata");
        const data = await res.json();

        if (!data.fitness || !data.mindfulness || !data.nourish) {
          console.error("Invalid nav data format", data);
          return;
        }

        setTopicsMap({
          Fitness: data.mixedTopics,
          Mindfulness: data.mixedTopics,
          Nourish: data.mixedTopics,
        });

        setSpotlightsMap({
          Fitness: data.fitness.spotlights,
          Mindfulness: data.mindfulness.spotlights,
          Nourish: data.nourish.spotlights,
        });
      } catch (error) {
        console.error("Failed to fetch nav data:", error);
      }
    };
    fetchNavData();
  }, []);

  return (
    <>
      <header className={classes.header}>
        <Link href="/" className={classes.logo}>
          <Image src={logoImg} alt="Wellness Pure Life" priority />
          <span className={classes.brandName}>
            <span className={classes.fullName}>Wellness Pure Life</span>
            <span className={classes.shortName}>WPL</span>
          </span>
        </Link>

        <div className={classes.rightControls}>
          {user && (
            <div className={`${classes.userControls} ${classes.mobileOnly}`}>
              <div className={classes.profileWrapper}>
                <button className={classes.profileButton}>
                  <FiUser size={18} style={{ marginRight: "0.4rem" }} />
                  <span className={classes.profileName}>
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                </button>
                <div className={classes.dropdownContent}>
                  <Link href="/dashboard" className={classes.dropdownLink}>
                    <FiUser size={16} /> Profile
                  </Link>
                  <button
                    onClick={() =>
                      signOut({
                        callbackUrl: "https://wellnesspurelife.com/",
                      })
                    }
                    className={classes.logoutLink}
                  >
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}
          {!user && status !== "loading" && (
            <div className={`${classes.authButtons} ${classes.desktopOnly}`}>
              <button onClick={openSignup} className={classes.authMiniBtn}>
                Sign Up
              </button>
              <button onClick={openLogin} className={classes.authMiniBtn}>
                Login
              </button>
            </div>
          )}
          {(user && !isVerified) || justSignedUp ? (
            <button
              className={`${classes.pendingVerify} ${
                resent ? classes.verifiedPendingResent : ""
              } ${classes.mobileOnly}`}
              onClick={async () => {
                const userEmail =
                  user?.email || localStorage.getItem("justSignedUpEmail");
                if (!userEmail) return toast.error("User email not available.");
                try {
                  const res = await fetch("/api/auth/emailverification", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: userEmail }),
                  });
                  if (!res.ok) throw new Error("Request failed");
                  toast.success("Verification email resent.");
                  setResent(true);
                } catch (err) {
                  console.error("Resend error:", err);
                  toast.error("❌ Failed to resend email. Please try again.");
                }
              }}
            >
              <span className={classes.pendingText}>
                <span className={classes.pendingTextIcon}>📬</span>
                Verify your email
              </span>
            </button>
          ) : (
            !user &&
            status !== "loading" &&
            !justSignedUp && (
              <div className={`${classes.authButtons} ${classes.mobileOnly}`}>
                <button onClick={openSignup} className={classes.authMiniBtn}>
                  Sign Up
                </button>
                <button onClick={openLogin} className={classes.authMiniBtn}>
                  Login
                </button>
              </div>
            )
          )}

          <button
            className={`${classes.hamburger} ${classes.mobileOnly}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        <nav
          className={`${classes.nav} ${mobileMenuOpen ? classes.showNav : ""}`}
        >
          <div className={classes.searchContainer}>
            <input
              type="text"
              placeholder="Find your personalized wellness plan…"
              className={classes.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  router.push(
                    `/search?q=${encodeURIComponent(searchQuery.trim())}`
                  );
                }
              }}
            />
            <button
              className={classes.searchButton}
              onClick={() => {
                if (searchQuery.trim()) {
                  router.push(
                    `/search?q=${encodeURIComponent(searchQuery.trim())}`
                  );
                }
              }}
            >
              🔍
            </button>
          </div>

          {!mobileMenuOpen && (
            <ul className={classes.desktopNavList}>
              {["Fitness", "Mindfulness", "Nourish"].map((label) => (
                <li
                  key={label}
                  className={classes.dropdownParent}
                  onMouseEnter={() => {
                    if (window.innerWidth > 768) {
                      setActiveDropdown(label);
                    }
                  }}
                  onMouseLeave={() => {
                    if (window.innerWidth > 768) {
                      setActiveDropdown(null);
                    }
                  }}
                >
                  <Link
                    href={`/${label.toLowerCase()}`}
                    className={classes.dropdownToggle}
                    onClick={() => handleDropdownToggle(label)}
                  >
                    {label}
                  </Link>
                  <div
                    className={`${classes.megaDropdown} ${
                      activeDropdown === label ? classes.show : ""
                    }`}
                  >
                    <div className={classes.topicsWrapper}>
                      <TopicsColumn
                        label={label}
                        topicsMap={topicsMap}
                        onLinkClick={() => setActiveDropdown(null)}
                      />
                    </div>
                    <div className={classes.megaRightColumn}>
                      <div className={classes.spotlightWrapper}>
                        <SpotlightColumn
                          label={label}
                          spotlightsMap={spotlightsMap}
                          onLinkClick={() => setActiveDropdown(null)}
                        />
                      </div>
                      <div className={classes.challengeWrapper}>
                        <ChallengeBox
                          onLinkClick={() => setActiveDropdown(null)}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}

              <li>
                <NavLink href="/blog">Blog</NavLink>
              </li>
              <li>
                <NavLink href="/news">News</NavLink>
              </li>
              <li>
                <NavLink href="/contact">Contact</NavLink>
              </li>
              <li className={classes.premiumNavItem}>
                <NavLink href="/premium">Premium</NavLink>
              </li>

              {/* weather + auth/profile part stays the same */}
              <li
                className={classes.weatherDropdownParent}
                onMouseEnter={() => setActiveDropdown("Weather")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span className={classes.weatherButton}>
                  {weather ? (
                    <div className={classes.weatherInfo}>
                      <img
                        src={weather.current.condition.icon}
                        alt={`Current weather: ${weather.current.condition.text}, ${weather.current.temp_c}°C in NY`}
                        className={classes.weatherIcon}
                      />
                      <div className={classes.weatherText}>
                        <span>{weather.current.temp_c}°C</span>
                        <span>{nyTime} NY</span>
                      </div>
                    </div>
                  ) : (
                    <span className={classes.loading}>Loading...</span>
                  )}
                </span>

                <div
                  className={`${classes.weatherMegaDropdown} ${
                    activeDropdown === "Weather" ? classes.show : ""
                  }`}
                >
                  <Weather />
                </div>
              </li>
              <li className={classes.profileNavItem}>
                {user ? (
                  <div className={classes.profileWrapper}>
                    <button className={classes.profileButton}>
                      <FiUser size={18} style={{ marginRight: "0.4rem" }} />
                      <span className={classes.profileName}>
                        {user?.name?.split(" ")[0] || "Account"}
                      </span>
                    </button>

                    <div className={classes.dropdownContent}>
                      <Link href="/dashboard" className={classes.dropdownLink}>
                        <FiUser size={16} /> Profile
                      </Link>
                      <button
                        onClick={() =>
                          signOut({
                            callbackUrl: "https://wellnesspurelife.com/",
                          })
                        }
                        className={classes.logoutLink}
                      >
                        <FiLogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={classes.authButtons}>
                    <button
                      onClick={openSignup}
                      className={classes.authMiniBtn}
                    >
                      Sign Up
                    </button>
                    <button onClick={openLogin} className={classes.authMiniBtn}>
                      Login
                    </button>
                  </div>
                )}
              </li>

              {/* existing auth/profile <li> block stays exactly as it is */}
              {/* ... your signup/login/profile li from before ... */}
            </ul>
          )}
        </nav>

        {mobileMenuOpen && (
          <MobileNav
            topicsMap={topicsMap}
            navItems={["Fitness", "Mindfulness", "Nourish"]}
            closeMenu={() => setMobileMenuOpen(false)}
            weather={weather}
            nyTime={nyTime}
            user={user}
          />
        )}

        <Signup
          isOpen={showSignup}
          onClose={closeSignup}
          onSignupComplete={handleSignupComplete}
          switchToLogin={() => {
            closeSignup();
            openLogin();
          }}
        />
        <Login
          isOpen={showLogin}
          onClose={closeLogin}
          onLoginSuccess={handleLoginSuccess}
          switchToSignup={() => {
            closeLogin();
            openSignup();
          }}
        />
      </header>
    </>
  );
}
