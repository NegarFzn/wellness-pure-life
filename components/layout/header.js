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
    if (router.pathname === "/fitness") {
      return [
        { href: "/mindfulness", label: "Mindfulness" },
        { href: "/nourish", label: "Nourish" },
      ];
    } else if (router.pathname === "/mindfulness") {
      return [
        { href: "/fitness", label: "Fitness" },
        { href: "/nourish", label: "Nourish" },
      ];
    } else if (router.pathname === "/nourish") {
      return [
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
          <Image src={logoImg} alt="Wellness Pure Life" />
          <span className={classes.brandName}>Healthy Body & Mind</span>
        </Link>
        <nav className={classes.nav}>
          <ul>
            {/* ✅ "News" Link - Always Visible */}
            <li>
              <NavLink href="/news">News</NavLink>
            </li>

            {/* ✅ "Weather" Link - Always Visible */}
            <div className={classes.weatherWidget}>
              <li>
                <NavLink href="/weather">Weather</NavLink>
                {weather ? (
                  <div className={classes.weatherInfo}>
                    <img
                      src={weather.current.condition.icon}
                      alt="Weather icon"
                    />
                    <span>{weather.current.temp_c}°C</span>
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
              </li>
            </div>

            {/* ✅ Show Relevant Links Based on Active Page */}
            {getNavLinks().map((link) => (
              <li key={link.href}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}
            <li>
              <NavLink href="/contact">Contact</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
