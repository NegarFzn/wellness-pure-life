import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ Allow public access to reset-password routes (incl. /reset-password/[token])
  if (pathname.startsWith("/reset-password")) {
    return NextResponse.next();
  }

  // Example: check login status using a cookie (adjust this to your auth method)
  const token = req.cookies.get("auth-token"); // adjust to your actual cookie name

  // 🔐 Protect selected private routes
  const protectedRoutes = ["/dashboard", "/account", "/profile", "/admin"];

  if (!token && protectedRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next(); // allow access to public pages
}
