import { prisma } from "@/lib/prisma";

export async function getStaffKPIs(staffId: number) {
  if (!staffId) throw new Error("staffId is required");

  const now = new Date();

  const startOfWeek = new Date();
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const assignedActions = await prisma.meetingmember.count({
    where: { StaffID: staffId },
  });

  const pendingDeadline = await prisma.meetingmember.count({
    where: {
      StaffID: staffId,
      meetings: {
        MeetingDate: { lt: now },
        Status: { not: "Completed" },
      },
    },
  });

  const meetingsThisWeek = await prisma.meetingmember.count({
    where: {
      StaffID: staffId,
      meetings: {
        MeetingDate: { gte: startOfWeek, lte: endOfWeek },
      },
    },
  });

  const totalMeetings = await prisma.meetingmember.count({
    where: { StaffID: staffId },
  });

  const presentMeetings = await prisma.meetingmember.count({
    where: { StaffID: staffId, IsPresent: true },
  });

  const attendanceRate =
    totalMeetings > 0 ? Math.round((presentMeetings / totalMeetings) * 100) : 0;

  return { assignedActions, pendingDeadline, meetingsThisWeek, attendanceRate };
}