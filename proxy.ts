import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Pages only for AUTHENTICATED users:
const PROTECTED_PAGES = ["settings", "home", "sessions"];

// Pages only for GUEST users (not logged in):
const AUTH_PAGES = ["login", "register"];

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Locale segment
  const locale = pathname.split("/")[1];

  // Current page segment
  const page = pathname.split(`/${locale}/`)[1]?.split("/")[0];

  // Cookie
  const hasToken = req.cookies.get("jwt")?.value;

  // 1️⃣ USER NOT LOGGED IN trying to access PROTECTED routes
  if (!hasToken && PROTECTED_PAGES.includes(page)) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // 2️⃣ USER LOGGED IN trying to access AUTH pages
  if (hasToken && AUTH_PAGES.includes(page)) {
    return NextResponse.redirect(new URL(`/${locale}/home`, req.url));
  }

  // Finally call next-intl middleware to handle locale
  return intlMiddleware(req);
}


export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
