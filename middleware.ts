// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { verifyToken } from "@/lib/auth";


// export async function middleware(req: NextRequest) {
//     const token = req.cookies.get("token")?.value;
//     console.log("Middleware check for:", req.nextUrl.pathname);
//     console.log("Token present:", !!token);

//     if (!token) {
//         console.log("No token, redirecting to /login");
//         return NextResponse.redirect(new URL("/login", req.url));
//     }


//     try {
//         await verifyToken(token);
//         console.log("Token verified, proceeding...");
//         return NextResponse.next();
//     } catch (err) {
//         console.log("Token verification failed, redirecting to /login");
//         return NextResponse.redirect(new URL("/login", req.url));
//     }
// }


// export const config = {
//     matcher: ["/dashboard/:path*"],
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // allow public routes
    if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;

    console.log("Middleware check for:", pathname);
    console.log("Token present:", !!token);

    if (!token) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    try {
        await verifyToken(token);
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/", req.url));
    }
}
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/meetings/:path*",
    "/meetingtype/:path*",
    "/staff/:path*",
    "/meetingmember/:path*"
  ],
};


