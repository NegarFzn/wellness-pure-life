import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (!token.isPremium) {
    return NextResponse.redirect(new URL("/premium", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/plan/weekly-plan",
    "/plan/daily-routine",
    "/programs/:path*",
    "/meditations/:path*",
    "/rituals/advanced",
  ],
};
