import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createMiddleware(routing);

// Only authenticated users
const PROTECTED_PAGES = [
  "home",
  "sessions",
  "settings",
  "streak",
  "task-planner",
];

// Only guests
const AUTH_PAGES = ["login", "register"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip API & static
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Extract locale & page
  const [, locale, page] = pathname.split("/");

  // 🔐 NextAuth session token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;

  // 🚫 Not logged in → protected page
  if (!isLoggedIn && PROTECTED_PAGES.includes(page)) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // 🚫 Logged in → auth pages
  if (isLoggedIn && AUTH_PAGES.includes(page)) {
    return NextResponse.redirect(new URL(`/${locale}/home`, req.url));
  }

  // 🌍 Let next-intl handle locale routing
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
