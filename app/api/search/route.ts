import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (query.length < 2) {
    return NextResponse.json({ meetings: [], staff: [] });
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Search Meetings
    const meetings = await prisma.meetings.findMany({
      where: {
        OR: [
          { MeetingDescription: { contains: query } },
          { Location: { contains: query } }
        ]
      },
      take: 5,
      orderBy: { MeetingDate: "desc" },
      include: { meetingtype: true }
    });

    // 2. Search Staff
    const staff = await prisma.staff.findMany({
      where: {
        OR: [
          { StaffName: { contains: query } },
          { EmailAddress: { contains: query } }
        ]
      },
      take: 5,
      orderBy: { StaffName: "asc" },
      include: { user: true }
    });

    return NextResponse.json({
      meetings: meetings.map(m => ({
        id: m.MeetingID,
        title: m.MeetingDescription || "General Meeting",
        date: new Date(m.MeetingDate).toLocaleDateString(),
        location: m.Location || "TBD",
        type: m.meetingtype?.MeetingTypeName || "General"
      })),
      staff: staff.map(s => ({
        id: s.StaffID,
        name: s.StaffName,
        email: s.EmailAddress,
        role: s.user?.Role || "Staff"
      }))
    });

  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
