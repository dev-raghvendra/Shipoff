import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";

const AUTH_PAGES = ["/login", "/signin"];

export default withAuth(
    function middleware(req) {
        const { token } = req.nextauth;
        const { pathname } = req.nextUrl;

        const isAuthPage = AUTH_PAGES.includes(pathname);
        const isAuthenticated = token && !token.error;

        if (!isAuthenticated) {
            if (isAuthPage) {
                return NextResponse.next();
            }
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("callbackUrl", req.url);

            const response = NextResponse.redirect(loginUrl);

            if (token?.error) {
                const cookieName = process.env.NODE_ENV === "production"
                    ? "__Secure-next-auth.session-token"
                    : "next-auth.session-token";
                response.cookies.delete(cookieName);
            }

            return response;
        }


        if (isAuthPage) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: () => true
        }
    }
)

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/signin"
    ]
}