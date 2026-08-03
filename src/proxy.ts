import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/infrastructure/lib/env";

const protectedRoutes = ["/learn", "/profile", "/quizzes", "/modes", "/practice", "/immerse", "/anchor-texts"];
const teacherRoutes = ["/teacher"];
const authRoutes = ["/auth/login", "/auth/register"];

const key = new TextEncoder().encode(env.JWT_SECRET);

async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("session")?.value;

  const session = sessionToken ? await verifyJWT(sessionToken) : null;
  const isAuthenticated = Boolean(session);

  // If user is accessing auth routes (login/register) while authenticated, redirect to /learn
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/learn", request.url));
    }
    return NextResponse.next();
  }

  // If user is accessing teacher routes, require teacher or admin role
  if (teacherRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session?.role !== "teacher" && session?.role !== "admin") {
      return NextResponse.redirect(new URL("/learn", request.url));
    }
    return NextResponse.next();
  }

  // If user is accessing protected routes without authentication
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const middleware = proxy;

export const config = {
  matcher: [
    "/learn/:path*",
    "/profile/:path*",
    "/quizzes/:path*",
    "/modes/:path*",
    "/practice/:path*",
    "/immerse/:path*",
    "/anchor-texts/:path*",
    "/teacher/:path*",
    "/auth/:path*",
  ],
};
