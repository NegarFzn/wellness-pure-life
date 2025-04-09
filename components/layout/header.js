import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router"; // ✅ Import useRouter for dynamic path check
import NavLink from "./nav-link";
import logoImg from "../../public/images/logo.jpg";
import classes from "./header.module.css";

export default function Header({ weather }) {
  const router = useRouter(); // ✅ Get current route

  // ✅ Define visible links based on the active page
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

  return (
    <>
      <header className={classes.header}>
        <Link href="/" className={classes.logo}>
          <Image src={logoImg} alt="Wellness Pure Life" priority/>
          <span className={classes.brandName}>Healthy Body & Mindd</span>
        </Link>
        <nav className={classes.nav}>
          <ul>
            <li>
              <NavLink href="/news">News</NavLink>
            </li>
            <li>
              <NavLink href="/contact">Contact</NavLink>
            </li>
            {/* ✅ "Weather" Link - Always Visible */}
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
                    <span
                      style={{
                        fontSize: "1rem",
                        color: "#ccc",
                        fontWeight: "normal",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Loading...
                    </span>
                  )}
                </NavLink>
              </li>
            </div>
            {/* ✅ Show Relevant Links Based on Active Page */}
            {getNavLinks().map((link) => (
              <li key={link.href}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
