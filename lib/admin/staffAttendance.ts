import { prisma } from "@/lib/prisma";

export type StaffAttendance = {
  StaffID: number;
  StaffName: string;
  TotalMeetings: number;
  Attended: number;
  Missed: number;
};

export async function getStaffAttendance(): Promise<StaffAttendance[]> {
  const staffList = await prisma.staff.findMany({
    include: {
      meetingmember: {
        include: { meetings: true },
      },
    },
  });

  const attendanceSummary: StaffAttendance[] = staffList.map((staff) => {
    const totalMeetings = staff.meetingmember.length;
    const attended = staff.meetingmember.filter((m) => m.IsPresent).length;
    const missed = totalMeetings - attended;

    return {
      StaffID: staff.StaffID,
      StaffName: staff.StaffName,
      TotalMeetings: totalMeetings,
      Attended: attended,
      Missed: missed,
    };
  });

  return attendanceSummary;
}