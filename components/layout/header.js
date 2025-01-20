import Link from "next/link";
import Image from "next/image";
import NavLink from "./nav-link";
import logoImg from "../../public/images/logo.jpg";
import classes from "./header.module.css";

export default function Header({ weather }) {
  return (
    <>
      <header className={classes.header}>
        <Link href="/" className={classes.logo}>
          <Image src={logoImg} alt="A health life" />
        </Link>
        <nav className={classes.nav}>
          <ul>
            <li>
              <NavLink href="/news">News</NavLink>
            </li>
            <li>
              <NavLink href="/weather">Weather</NavLink>
            </li>
            <div className={classes.weatherWidget}>
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
            </div>
          </ul>
        </nav>
      </header>
    </>
  );
}
