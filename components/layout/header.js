import Link from "next/link";
import Image from "next/image";
import NavLink from "./nav-link";
import logoImg from '../../public/images/logo.jpg';
import classes from "./header.module.css";


export default function Header() {
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
              <NavLink href="/community">Community</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
