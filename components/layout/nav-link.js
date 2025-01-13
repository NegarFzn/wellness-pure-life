"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classes from "./nav-link.module.css";

export default function NavLink({ href, children }) {
  const path = usePathname();

  const isActive = path ? path.startsWith(href) : false;

  return (
    <Link
      href={href}
      className={isActive ? `${classes.active} ${classes.link}` : classes.link}
    >
      {children}
    </Link>
  );
}
