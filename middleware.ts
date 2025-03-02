import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["fr", "en", "de"] as const;
const defaultLocale = "fr";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const referer = request.headers.get("referer");

  // Check if the pathname already has a locale
  if (
    locales.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )
  ) {
    return NextResponse.next();
  }

  // Determine the locale from the referer or default to the defaultLocale
  const locale =
    (referer &&
      locales.find((locale) =>
        new URL(referer).pathname.startsWith(`/${locale}`)
      )) ||
    defaultLocale;

  // Redirect to the localized path
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next|_next/image|api|admin|public|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.webp$).*)"
  ] // Exclude specific paths
};
