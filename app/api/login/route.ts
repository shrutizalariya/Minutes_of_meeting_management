// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { signToken } from "@/lib/auth";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const email = body.email?.toLowerCase(); // normalize email
//     const password = body.password;
  //const role = body.role; 

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // Find user by email
//     const user = await prisma.users.findUnique({ where: { Email: email } });

//     // Guard against null
//     if (!user || !user.Password || !user.Email || !user.Role) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Compare password
//     const isValid = await bcrypt.compare(password, user.Password);
//     if (!isValid) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Generate JWT (assert Email & Role as string)
//     const token = await signToken({
//       id: user.Id,
//       email: user.Email, 
//       role: user.Role,
//     });

//     // Return response with cookie
//     const res = NextResponse.json({
//       success: true,
//       user: { id: user.Id, email: user.Email, role: user.Role },
//     });

//     res.cookies.set("token", token, {
//       httpOnly: true,
//       path: "/",
//       maxAge: 60 * 60, // 1 hour
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//     });

//     return res;
//   } catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { signToken } from "@/lib/auth";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const email = body.email?.toLowerCase();
//     const password = body.password;
//     const role = body.role; 

//     if (!email || !password || !role) {
//       return NextResponse.json(
//         { error: "Email, password, and role are required" },
//         { status: 400 }
//       );
//     }

//     // Find user by email
//     const user = await prisma.users.findUnique({ where: { Email: email } });

//     if (!user) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Compare password
//     const isValid = await bcrypt.compare(password, user.Password);
//     if (!isValid) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Check role matches database
//     if (user.Role !== role) {
//       return NextResponse.json(
//         { error: "Role does not match" },
//         { status: 401 }
//       );
//     }

//     // Generate JWT
//     const token = await signToken({
//       id: user.Id,
//       email: user.Email!,
//       role: user.Role,
//     });

//     // Return response with cookie
//     const res = NextResponse.json({
//       success: true,
//       user: { id: user.Id, email: user.Email, role: user.Role },
//     });

//     res.cookies.set("token", token, {
//       httpOnly: true,
//       path: "/",
//       maxAge: 60 * 60,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//     });

//     return res;

//   } catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email?.toLowerCase().trim();
    const password = body.password;
    const role = body.role?.trim();

    // 1️⃣ Check empty fields
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, Password and Role are required" },
        { status: 400 }
      );
    }

    // 2️⃣ Find user
    const user = await prisma.users.findUnique({
      where: { Email: email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 401 }
      );
    }

    // 3️⃣ Check password
    const validPassword = await bcrypt.compare(password, user.Password);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // 4️⃣ Check role match (IMPORTANT)
    if (user.Role.toLowerCase() !== role.toLowerCase()) {
      return NextResponse.json(
        { error: "Email, Password and Role do not match" },
        { status: 401 }
      );
    }

    // 5️⃣ Generate token
    const token = await signToken({
      id: user.Id,
      email: user.Email!,
      role: user.Role!,
    });

    // 6️⃣ Response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.Id,
        email: user.Email,
        role: user.Role,
      },
    });

    response.cookies.set("token", token, {
      // name: "jwt",
      // value:token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60,
      sameSite: "lax",
    });

    return response;
    
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}