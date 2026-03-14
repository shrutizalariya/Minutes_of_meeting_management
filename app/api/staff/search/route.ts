import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { searchStaffData } from "@/app/dashboard/staff/StaffDashboardService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const token = request.cookies.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (!payload?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const staff = await prisma.staff.findUnique({
      where: { UserID: payload.id }
    });

    if (!staff) return NextResponse.json({ error: "Staff not found" }, { status: 404 });

    if (!query) return NextResponse.json([]);

    const results = await searchStaffData(staff.StaffID, query);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
