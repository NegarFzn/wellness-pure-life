import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavLink from "./nav-link";
import { signOut, useSession } from "next-auth/react";
import { useUI } from "../../context/UIContext";
import Signup from "../Auth/Signup";
import Login from "../Auth/Login";
import { toast } from "react-toastify";
import logoImg from "../../public/images/logo.jpg";
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

            {!user && status !== "loading" ? (
              justSignedUp ? (
                <li
                  className={`${classes.pendingVerify} ${
                    resent ? classes.verifiedPendingResent : ""
                  }`}
                  onClick={async () => {
                    const userEmail =
                      user?.email || localStorage.getItem("justSignedUpEmail");

                    if (!userEmail) {
                      toast.error("User email not available.");
                      return;
                    }

                    try {
                      const res = await fetch("/api/auth/emailverification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: userEmail }),
                      });

                      if (!res.ok) throw new Error("Request failed");
                      toast.success("✅ Verification email resent.");
                      setResent(true);
                    } catch (err) {
                      console.error("Resend error:", err);
                      toast.error(
                        "❌ Failed to resend email. Please try again."
                      );
                    }
                  }}
                >
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
              user && (
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
              )
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
