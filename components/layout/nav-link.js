"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { gaEvent } from "../../lib/gtag";
import classes from "./nav-link.module.css";

export default function NavLink({ href, children }) {
  const router = useRouter();
  const pathname = router.pathname || "";

  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`${classes.link} ${isActive ? classes.active : ""}`}
      onClick={() => {
        gaEvent("header_nav_click", {
          href,
          label: children,
        });
      }}
    >
      {children}
    </Link>
  );
}
