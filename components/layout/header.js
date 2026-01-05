import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

import logoImg from "../../public/images/logo.png";
import classes from "./header.module.css";

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user || null;

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDropdown = (label) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <>
      <header className={classes.headerOuter}>
        <div className={classes.headerContainer}>
          {/* LOGO */}
          <Link href="/" className={classes.logoBlock}>
            <Image
              src={logoImg}
              width={48}
              height={48}
              alt="Wellness Pure Life"
              className={classes.logoImage}
              priority
            />
            <span className={classes.brand}>Wellness Pure Life</span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className={classes.nav}>
            {/* FITNESS */}
            <div
              className={classes.navItem}
              onMouseEnter={() => setActiveDropdown("Fitness")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={classes.navButton}
                onClick={() => toggleDropdown("Fitness")}
              >
                Fitness ▾
              </button>

              {activeDropdown === "Fitness" && (
                <div
                  className={`${classes.dropdownMenu} ${classes.showDropdown}`}
                >
                  <Link
                    href="/fitness/workouts"
                    className={classes.dropdownItem}
                  >
                    Workouts
                  </Link>
                  <Link
                    href="/fitness/stretches"
                    className={classes.dropdownItem}
                  >
                    Stretches
                  </Link>
                  <Link
                    href="/fitness/challenges"
                    className={classes.dropdownItem}
                  >
                    Challenges
                  </Link>
                  <Link href="/fitness/plans" className={classes.dropdownItem}>
                    Fitness Plans
                  </Link>
                </div>
              )}
            </div>

            {/* MINDFULNESS */}
            <div
              className={classes.navItem}
              onMouseEnter={() => setActiveDropdown("Mindfulness")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={classes.navButton}
                onClick={() => toggleDropdown("Mindfulness")}
              >
                Mindfulness ▾
              </button>

              {activeDropdown === "Mindfulness" && (
                <div
                  className={`${classes.dropdownMenu} ${classes.showDropdown}`}
                >
                  <Link
                    href="/mindfulness/breathing"
                    className={classes.dropdownItem}
                  >
                    Breathing
                  </Link>
                  <Link
                    href="/mindfulness/meditation"
                    className={classes.dropdownItem}
                  >
                    Meditation
                  </Link>
                  <Link
                    href="/mindfulness/stress"
                    className={classes.dropdownItem}
                  >
                    Stress Relief
                  </Link>
                  <Link
                    href="/mindfulness/plans"
                    className={classes.dropdownItem}
                  >
                    Mindfulness Plans
                  </Link>
                </div>
              )}
            </div>

            {/* NOURISH */}
            <div
              className={classes.navItem}
              onMouseEnter={() => setActiveDropdown("Nourish")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={classes.navButton}
                onClick={() => toggleDropdown("Nourish")}
              >
                Nourish ▾
              </button>

              {activeDropdown === "Nourish" && (
                <div
                  className={`${classes.dropdownMenu} ${classes.showDropdown}`}
                >
                  <Link href="/nourish/meals" className={classes.dropdownItem}>
                    Healthy Meals
                  </Link>
                  <Link
                    href="/nourish/recipes"
                    className={classes.dropdownItem}
                  >
                    Recipes
                  </Link>
                  <Link href="/nourish/plans" className={classes.dropdownItem}>
                    Meal Plans
                  </Link>
                </div>
              )}
            </div>

            <Link href="/blog" className={classes.navLink}>
              Blog
            </Link>
          </nav>

          {/* RIGHT CONTROLS */}
          <div className={classes.controls}>
            {/* SEARCH ICON */}
            <button
              className={classes.searchIcon}
              onClick={() => setShowSearch(true)}
            >
              🔍
            </button>

            {/* PREMIUM BUTTON */}
            <Link href="/premium" className={classes.premiumButton}>
              Premium
            </Link>

            {/* USER MENU */}
            {user ? (
              <div className={classes.userMenuWrapper}>
                <button className={classes.userMenuButton}>
                  {user.name?.split(" ")[0] || "Account"} ▾
                </button>

                <div className={classes.dropdownMenu}>
                  <Link href="/dashboard" className={classes.dropdownItem}>
                    Profile
                  </Link>

                  <button
                    onClick={() => signOut()}
                    className={classes.dropdownItem}
                    style={{
                      textAlign: "left",
                      width: "100%",
                      border: "none",
                      background: "none",
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className={classes.authButtons}>
                <button onClick={() => router.push("/signup")}>Sign Up</button>
                <button onClick={() => router.push("/login")}>Login</button>
              </div>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              className={classes.mobileHamburger}
              onClick={() => setMobileOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* SEARCH MODAL */}
      {showSearch && (
        <div
          className={classes.searchModalOverlay}
          onClick={() => setShowSearch(false)}
        >
          <div
            className={classes.searchModal}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="Search wellness…"
              className={classes.searchModalInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(
                    `/search?q=${encodeURIComponent(e.target.value)}`
                  );
                  setShowSearch(false);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* MOBILE NAV */}
      {mobileOpen && (
        <div
          className={classes.mobileNavOverlay}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className={classes.mobileNav}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={classes.mobileClose}
              onClick={() => setMobileOpen(false)}
            >
              ✕
            </button>

            <Link href="/fitness" className={classes.mobileNavItem}>
              Fitness
            </Link>
            <Link href="/mindfulness" className={classes.mobileNavItem}>
              Mindfulness
            </Link>
            <Link href="/nourish" className={classes.mobileNavItem}>
              Nourish
            </Link>
            <Link href="/blog" className={classes.mobileNavItem}>
              Blog
            </Link>
            <Link href="/premium" className={classes.mobileNavPremium}>
              Premium
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" className={classes.mobileNavItem}>
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className={classes.mobileNavItem}
                  style={{ textAlign: "left" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/signup")}
                  className={classes.mobileNavItem}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className={classes.mobileNavItem}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
