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
    
    // Fetch User with Staff details
    const user = await prisma.users.findUnique({
      where: { Id: payload.id },
      include: { staff: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // --- Dynamic Data Aggregation ---

    // 1. Management Metrics
    const totalMeetingsCount = await prisma.meetings.count();
    
    const draftMinutesCount = await prisma.meetings.count({
      where: { Status: "Scheduled" }
    });

    // 2. Pending Documentation (Recent Meetings)
    const pendingMeetings = await prisma.meetings.findMany({
      take: 5,
      orderBy: { MeetingDate: "desc" },
      include: {
        _count: { select: { meetingmember: true } },
        meetingmember: {
          where: { Remarks: { not: null, not: "" } }
        }
      }
    });

    // 3. Recent Assignments (from MeetingMember Remarks)
    const recentAssignments = await prisma.meetingmember.findMany({
      where: {
        Remarks: { not: null, not: "" }
      },
      include: {
        staff: true,
        meetings: true
      },
      take: 5,
      orderBy: { Created: "desc" }
    });

    // Formatting Data for Frontend
    return NextResponse.json({
      userProfile: {
        name: user.Name || "Convener",
        email: user.Email,
        role: user.Role,
        initials: (user.Name || "SC").split(" ").map(n => n[0]).join("").toUpperCase()
      },
      metrics: {
        convenedSessions: totalMeetingsCount.toString().padStart(2, '0'),
        draftMinutes: draftMinutesCount.toString().padStart(2, '0'),
        avgAttendance: "92%", // Placeholder for complex calc
        resolvedItems: recentAssignments.length.toString().padStart(2, '0')
      },
      meetings: pendingMeetings.map(m => ({
        id: m.MeetingID,
        title: m.MeetingDescription || "General Meeting",
        members: `${m._count.meetingmember}/${m._count.meetingmember}`, // Logic can be refined
        actions: m.meetingmember.length.toString().padStart(2, '0'),
        state: m.Status === "Scheduled" ? "Needs Minutes" : "Ready",
        location: m.Location || "Boardroom",
        urgent: m.Status === "Scheduled"
      })),
      assignments: recentAssignments.map(a => ({
        staff: a.staff?.StaffName || "Unknown Staff",
        task: a.Remarks,
        deadline: new Date(a.meetings.MeetingDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
      }))
    });

  } catch (error) {
    console.error("Convener Dashboard API Error:", error);
    return NextResponse.json({ error: "Unauthorized or Server Error" }, { status: 401 });
  }
}
