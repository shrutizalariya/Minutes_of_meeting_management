import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meetingId = Number(id);

  if (isNaN(meetingId)) {
    return NextResponse.json({ error: "Invalid meeting ID" }, { status: 400 });
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const members = await prisma.meetingmember.findMany({
      where: { MeetingID: meetingId },
      include: { staff: true },
      orderBy: { staff: { StaffName: "asc" } }
    });

    return NextResponse.json(members.map(m => ({
      MeetingMemberID: m.MeetingMemberID,
      StaffID: m.StaffID,
      StaffName: m.staff?.StaffName || "Unknown",
      IsPresent: m.IsPresent || false,
      Remarks: m.Remarks
    })));

  } catch (error) {
    console.error("Meeting Members API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
