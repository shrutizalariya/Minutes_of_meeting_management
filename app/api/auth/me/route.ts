import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token) as { id: number; email: string; role: string };
    
    const user = await prisma.users.findUnique({
      where: { Id: payload.id },
      select: { 
        Id: true,
        Name: true, 
        Email: true, 
        Role: true 
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const name = user.Name || "User";
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();

    return NextResponse.json({
      id: user.Id,
      name: name,
      email: user.Email,
      role: user.Role,
      initials: initials
    });

  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
