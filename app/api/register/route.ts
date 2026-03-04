import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email?.toLowerCase() ?? ""; // fallback to empty string
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { Email: email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.users.create({
      data: {
        Email: email,
        Password: hash,
        Role: body.role ?? "user", // fallback role
      },
    });

    // Ensure email and role are strings (not null) for JWT
    const userEmail: string = user.Email ?? "";
    const userRole: string = user.Role ?? "user";

    // Generate JWT
    const token = await signToken({
      id: user.Id,
      email: userEmail,
      role: userRole,
    });

    // Set cookie and return response
    const res = NextResponse.json({
      success: true,
      user: { id: user.Id, email: userEmail, role: userRole },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 hour
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
