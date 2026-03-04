// import { cookies } from "next/headers";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// // create session cookie
// export async function createSession(userId: string) {
//   const cookieStore = await cookies();

//   cookieStore.set("session", userId, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "lax",
//     path: "/",
//   });
// }

// // read session cookie
// export async function getSession() {
//   const cookieStore = await cookies();
//   return cookieStore.get("session")?.value;
// }

// // delete session cookie
// export async function destroySession() {
//   const cookieStore = await cookies();
//   cookieStore.delete("session");
// }

// // Fake DB check
// export async function verifyUser(email: string, password: string) {
//   if (email === "admin@test.com" && password === "1234") {
//     return { id: "1", role: "admin" };
//   }
//   return null;
// }






























// // import { cookies } from "next/headers";
// // import { prisma } from "./prisma";
// // import bcrypt from "bcryptjs";

// // export async function createSession(user: { id: string; role: string }) {
// //   const cookieStore = await cookies();


// //   cookieStore.set("session", JSON.stringify({ ...user, id: user.id.toString() }), {
// //     httpOnly: true,
// //     secure: true,
// //     sameSite: "lax",
// //     path: "/",
// //   });
// // }

// // export async function getSession() {
// //   const cookieStore = await cookies();
// //   const value = cookieStore.get("session")?.value;
// //   return value ? JSON.parse(value) : null;
// // }

// // export async function destroySession() {
// //   const cookieStore = await cookies();
// //   cookieStore.delete("session");
// // }

// // export async function verifyUser(email: string, password: string) {
// //   const user = await prisma.users.findUnique({
// //     where: { Email: email },
// //   });

// //   if (!user) return null;

// //   const valid = await bcrypt.compare(password, user.Password);
// //   if (!valid) return null;

// //   return {
// //     id: user.Id,
// //     role: user.Role,
// //   };
// // }

import { SignJWT, jwtVerify } from "jose";


const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");


export async function signToken(user: { id: number; email: string; role: string }) {
    return await new SignJWT(user)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m")
        .sign(JWT_SECRET);
}


export async function verifyToken(token: string) {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
}