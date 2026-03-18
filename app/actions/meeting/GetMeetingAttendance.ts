"use server";

import { prisma } from "@/lib/prisma";

export async function getMeetingAttendance(meetingId: number) {
  try {
    const members = await prisma.meetingmember.findMany({
      where: { MeetingID: meetingId },
      include: {
        staff: {
          select: {
            StaffID: true,
            StaffName: true,
            EmailAddress: true,
          },
        },
      },
      orderBy: { staff: { StaffName: "asc" } },
    });

    return members.map((m) => ({
      MeetingMemberID: m.MeetingMemberID,
      StaffID: m.StaffID,
      StaffName: m.staff.StaffName,
      EmailAddress: m.staff.EmailAddress || "",
      IsPresent: m.IsPresent ?? false,
      Remarks: m.Remarks || "",
    }));
  } catch (error) {
    console.error("Get meeting attendance error:", error);
    return [];
  }
}
