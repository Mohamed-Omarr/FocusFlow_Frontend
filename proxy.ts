import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { supabaseSessionProxy } from "./lib/supabase/proxy";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
   const authResponse = await supabaseSessionProxy(req);
  if (authResponse.status !== 200) return authResponse;
  // Finally call next-intl middleware to handle locale
  return intlMiddleware(req);
}


export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
