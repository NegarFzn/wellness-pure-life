import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavLink from "./nav-link";
import { signOut, useSession } from "next-auth/react";
import { useUI } from "../../context/UIContext";
import Signup from "../Auth/Signup";
import Login from "../Auth/Login";
import logoImg from "../../public/images/logo.jpg";
import classes from "./header.module.css";

export default function Header({ weather }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user || null;
  const loading = status === "loading";

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
    closeLogin();
  };

  const showVerifyPrompt = justSignedUp && !user;

  return (
    <>
      {showVerifyPrompt && (
        <div className={classes.verifyPromptBanner}>
          ✅ Thank you for signing up! Please check your email to verify your
          account.
        </div>
      )}
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

            {!user ? (
              justSignedUp ? (
                <li className={classes.pendingVerify}>
                  <span className={classes.pendingText}>
                    📬 Verify your email
                  </span>
                </li>
              ) : (
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
              )
            ) : (
              <>
                <li className={classes.welcome}>
                  <button
                    onClick={() => {
                      router.push("/dashboard");
                    }}
                    className={classes.navBtn}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    👤 {user?.name || user?.email?.split("@")[0] || "Account"}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      console.log("🚪 Logged out");
                    }}
                    className={classes.navBtn}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
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
