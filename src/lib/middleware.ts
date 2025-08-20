import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile"];

export async function middleware(request: NextRequest) {
	const { nextUrl } = request;
	const sessionCookie = getSessionCookie(request);

	const res = NextResponse.next();
	const isLoggedIn = !!sessionCookie;
	const isOnProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
	const isOnAuthRoute = nextUrl.pathname.startsWith("/auth");

	if (isOnProtectedRoute && !isLoggedIn) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	if (isOnAuthRoute && isLoggedIn) {
		return NextResponse.redirect(new URL("/profile", request.url));
	}

	return res;
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"], // Specify the routes the middleware applies to
};
