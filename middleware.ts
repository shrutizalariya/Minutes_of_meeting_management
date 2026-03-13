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

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { verifyToken } from "@/lib/auth";

// // Role permissions
// const roleAccess: Record<string, string[]> = {
//   admin: [
//     "/dashboard",
//     "/meetings",
//     "/meetingtype",
//     "/staff",
//     "/meetingmember",
//   ],
//   staff: [
//     "/meetings",
//   ],
// };

// export async function middleware(req: NextRequest) {

//   const { pathname } = req.nextUrl;

//   // Public routes
//   if (
//     pathname.startsWith("/login") ||
//     pathname.startsWith("/api") ||
//     pathname.startsWith("/_next") ||
//     pathname.includes(".")
//   ) {
//     return NextResponse.next();
//   }

//   const token = req.cookies.get("token")?.value;

//   // No token → redirect to login
//   if (!token) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   try {

//     const user = await verifyToken(token) as {
//       StaffID: number;
//       Role: string;
//     };

//     const role = user.Role;

//     console.log("User role:", role);
//     console.log("Requested path:", pathname);

//     const allowedRoutes = roleAccess[role];

//     if (!allowedRoutes) {
//       return NextResponse.redirect(new URL("/", req.url));
//     }

//     // Check if user has permission for this route
//     const isAllowed = allowedRoutes.some(route =>
//       pathname.startsWith(route)
//     );

//     if (!isAllowed) {

//       // staff trying to open admin page
//       if (role === "staff") {
//         return NextResponse.redirect(new URL("/meetings", req.url));
//       }

//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }

//     return NextResponse.next();

//   } catch (error) {

//     console.log("Token verification failed");

//     return NextResponse.redirect(new URL("/", req.url));
//   }
// }

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/meetings/:path*",
//     "/meetingtype/:path*",
//     "/staff/:path*",
//     "/meetingmember/:path*"
//   ],
// };


