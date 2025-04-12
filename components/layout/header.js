import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavLink from "./nav-link";
import { useAuth } from "../../context/AuthContext";
import Signup from "../Auth/Signup";
import logoImg from "../../public/images/logo.jpg";
import classes from "./header.module.css";

export default function Header({ weather }) {
  const router = useRouter();
  const { user } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);

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
            <div className={classes.weatherWidget}>
              <li>
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
            </div>

            {getNavLinks().map((link) => (
              <li key={link.href}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}

            {/* Auth logic */}
            {!user && !justSignedUp ? (
              <>
                <li>
                  <button
                    onClick={() => setShowSignup(true)}
                    className={classes.navBtn}
                  >
                    Sign Up Free
                  </button>
                </li>
                <li>
                  <Link href="/login">
                    <button className={classes.navBtn}>Login</button>
                  </Link>
                </li>
              </>
            ) : user ? (
              <li className={classes.welcome}>
                <strong>{user.email.split("@")[0]}</strong>
              </li>
            ) : null}
          </ul>
        </nav>
        <Signup
          isOpen={showSignup}
          onClose={() => setShowSignup(false)}
          onSignupComplete={handleSignupComplete}
        />
      </header>
    </>
  );
}
