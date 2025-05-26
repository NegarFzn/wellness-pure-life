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
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";
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

  const getNavLinks = () => {
    const coreLinks = [
      { href: "/fitness", label: "Fitness" },
      { href: "/mindfulness", label: "Mindfulness" },
      { href: "/nourish", label: "Nourish" },
    ];

    if (router.pathname === "/") {
      return coreLinks;
    } else if (router.pathname.startsWith("/fitness")) {
      return coreLinks.filter((link) => link.href !== "/fitness");
    } else if (router.pathname.startsWith("/mindfulness")) {
      return coreLinks.filter((link) => link.href !== "/mindfulness");
    } else if (router.pathname.startsWith("/nourish")) {
      return coreLinks.filter((link) => link.href !== "/nourish");
    } else if (
      router.pathname.startsWith("/news") ||
      router.pathname.startsWith("/contact") ||
      router.pathname.startsWith("/weather")
    ) {
      return coreLinks;
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
          <span className={classes.brandName}>Wellness Pure Life</span>
        </Link>
        <nav className={classes.nav}>
          <ul>
            {getNavLinks().map((link) => (
              <li key={link.href}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}
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
                      style={{ width: 22, height: 22 }}
                    />
                    <div>
                      <span style={{ fontSize: "0.85rem" }}>
                        {weather.current.temp_c}°C
                      </span>
                      <br />
                      <span style={{ fontSize: "0.7rem" }}>{nyTime} NY</span>
                    </div>
                  </div>
                ) : (
                  <span className={classes.loading}>Loading...</span>
                )}
              </NavLink>
            </li>

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
                      toast.success("Verification email resent.");
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
                    <span className={classes.pendingTextIcon}>📬</span>
                    Verify your email
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
                  <li className={classes.profileDropdown}>
                    <div className={classes.profileWrapper}>
                      <button className={classes.profileButton}>
                        <FiUser size={18} />
                        {(user?.name || "Account").charAt(0).toUpperCase() +
                          (user?.name || "Account").slice(1)}
                      </button>
                      <div className={classes.dropdownContent}>
                        <Link
                          href="/dashboard"
                          className={classes.dropdownLink}
                        >
                          <FiUser size={16} /> Profile
                        </Link>
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className={classes.logoutLink}
                        >
                          <FiLogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
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
