import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavLink from "./nav-link";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import Signup from "../Auth/Signup";
import Login from "../Auth/Login";
import logoImg from "../../public/images/logo.jpg";
import classes from "./header.module.css";

export default function Header({ weather }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const {
    openLogin,
    openSignup,
    showLogin,
    showSignup,
    closeLogin,
    closeSignup,
  } = useUI();
  const [justSignedUp, setJustSignedUp] = useState(false);

  useEffect(() => {
    console.log("🔥 FINAL CHECK", { user, loading, pathname: router.pathname });
  }, [user, loading, router.pathname]);

  useEffect(() => {
    const checkFlag = () => {
      if (
        typeof window !== "undefined" &&
        localStorage.getItem("justSignedUp") === "true"
      ) {
        setJustSignedUp(true);
      }
    };

    checkFlag(); // Initial check

    // Listen for changes in localStorage
    window.addEventListener("storage", checkFlag);

    return () => {
      window.removeEventListener("storage", checkFlag);
    };
  }, []);

  // ✅ Reset justSignedUp if user logs out
  useEffect(() => {
    if (!user) {
      localStorage.removeItem("justSignedUp");
      setJustSignedUp(false);
    }
  }, [user]);

  const getNavLinks = () => {
    if (router.pathname.startsWith("/fitness")) {
      return [
        { href: "/mindfulness", label: "Mindfulness" },
        { href: "/nourish", label: "Nourish" },
      ];
    } else if (router.pathname.startsWith("/mindfulness")) {
      return [
        { href: "/fitness", label: "Fitness" },
        { href: "/nourish", label: "Nourish" },
      ];
    } else if (router.pathname.startsWith("/nourish")) {
      return [
        { href: "/mindfulness", label: "Mindfulness" },
        { href: "/fitness", label: "Fitness" },
      ];
    } else if (
      router.pathname.startsWith("/news") ||
      router.pathname.startsWith("/contact") ||
      router.pathname.startsWith("/weather")
    ) {
      return [
        { href: "/nourish", label: "Nourish" },
        { href: "/mindfulness", label: "Mindfulness" },
        { href: "/fitness", label: "Fitness" },
      ];
    }
    return [];
  };

  const handleSignupComplete = () => {
    setJustSignedUp(true);
  };

  const handleLoginSuccess = () => {
    closeLogin(); // ✅ from useUI()
  };

  return (
    <>
      <header className={classes.header}>
        <Link href="/" className={classes.logo}>
          <Image src={logoImg} alt="Wellness Pure Life" priority />
          <span className={classes.brandName}>Healthy Body & Mind</span>
        </Link>
        <nav className={classes.nav}>
          <ul>
            <li>
              <NavLink href="/news">News</NavLink>
            </li>
            <li>
              <NavLink href="/contact">Contact</NavLink>
            </li>
            <li className={classes.weatherWidget}>
              <NavLink href="/weather">
                {weather ? (
                  <div className={classes.weatherInfo}>
                    <img
                      src={weather.current.condition.icon}
                      alt="Weather icon"
                    />
                    <span>{weather.current.temp_c}°C (NY)</span>
                  </div>
                ) : (
                  <span className={classes.loading}>Loading...</span>
                )}
              </NavLink>
            </li>

            {getNavLinks().map((link) => (
              <li key={link.href}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}

            {/* Auth logic */}
            {!user && !justSignedUp ? (
              <>
                <li>
                  <button onClick={openSignup} className={classes.navBtn}>
                    Sign Up Free
                  </button>
                </li>
                <li>
                  <button onClick={openLogin} className={classes.navBtn}>
                    Login
                  </button>
                </li>
              </>
            ) : user ? (
              <>
                <li className={classes.welcome}>
                  <button
                    onClick={() => {
                      if (user) {
                        console.log("Navigating to dashboard");
                        router.push("/dashboard");
                      } else {
                        openLogin(); // fallback protection
                      }
                    }}
                    className={classes.navBtn}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    👤{" "}
                    {user?.displayName ||
                      user?.email?.split("@")[0] ||
                      "Account"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={async () => {
                      await signOut(auth);
                      console.log("🚪 Logged out");
                      router.push("/");
                    }}
                    className={classes.navBtn}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : null}
          </ul>
        </nav>
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
