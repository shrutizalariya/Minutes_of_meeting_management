import { prisma } from "@/lib/prisma";

export type MeetingType = {
  MeetingTypeID: number;
  MeetingTypeName: string;
};

export type Meeting = {
  MeetingID: number;
  MeetingDate: string;
  MeetingDescription?: string;
  meetingtype?: MeetingType;
};

export type MeetingMember = {
  MeetingMemberID: number;
  MeetingID: number;
  StaffID: number;
  IsPresent?: boolean;
  Remarks?: string;
  Created?: Date;
  Modified?: Date;
  meetings?: Meeting;
};

export type StaffDashboardData = {
  assignedActions: number;
  pendingDeadline: number;
  meetingsThisWeek: number;
  attendanceRate: number;
  tasks: MeetingMember[];
  schedules: Meeting[];
};

export async function getStaffDashboard(staffId: number): Promise<StaffDashboardData> {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  // KPIs
  const assignedActions = await prisma.meetingmember.count({
    where: { StaffID: staffId },
  });

  const pendingDeadline = await prisma.meetings.count({
    where: { Status: "Scheduled" },
  });

  const meetingsThisWeek = await prisma.meetings.count({
    where: {
      MeetingDate: { gte: today, lte: nextWeek },
    },
  });

  // Attendance
  const totalAttendance = await prisma.meetingmember.count({ where: { StaffID: staffId } });
  const presentAttendance = await prisma.meetingmember.count({
    where: { StaffID: staffId, IsPresent: true },
  });
  const attendanceRate = totalAttendance === 0 ? 0 : Math.round((presentAttendance / totalAttendance) * 100);

  // Tasks (latest 5)
  const tasksRaw = await prisma.meetingmember.findMany({
    where: { StaffID: staffId },
    include: { meetings: { include: { meetingtype: true } } },
    orderBy: { Created: "desc" },
    take: 5,
  });

  // Normalize nulls → undefined and convert Date to string
  const tasks: MeetingMember[] = tasksRaw.map((t) => ({
    MeetingMemberID: t.MeetingMemberID,
    MeetingID: t.MeetingID,
    StaffID: t.StaffID,
    IsPresent: t.IsPresent ?? undefined,
    Remarks: t.Remarks ?? undefined,
    Created: t.Created ?? undefined,
    Modified: t.Modified ?? undefined,
    meetings: t.meetings
      ? {
          MeetingID: t.meetings.MeetingID,
          MeetingDate: t.meetings.MeetingDate.toISOString(),
          MeetingDescription: t.meetings.MeetingDescription ?? undefined,
          meetingtype: t.meetings.meetingtype
            ? {
                MeetingTypeID: t.meetings.meetingtype.MeetingTypeID,
                MeetingTypeName: t.meetings.meetingtype.MeetingTypeName,
              }
            : undefined,
        }
      : undefined,
  }));

  // Upcoming schedules (next 5 meetings)
  const schedulesRaw = await prisma.meetings.findMany({
    where: { MeetingDate: { gte: today } },
    include: { meetingtype: true },
    orderBy: { MeetingDate: "asc" },
    take: 5,
  });

  const schedules: Meeting[] = schedulesRaw.map((m) => ({
    MeetingID: m.MeetingID,
    MeetingDate: m.MeetingDate.toISOString(),
    MeetingDescription: m.MeetingDescription ?? undefined,
    meetingtype: m.meetingtype
      ? {
          MeetingTypeID: m.meetingtype.MeetingTypeID,
          MeetingTypeName: m.meetingtype.MeetingTypeName,
        }
      : undefined,
  }));

   console.log("Server: assignedActions", assignedActions);
  console.log("Server: tasks", tasks);           // Tasks fetched from DB
  console.log("Server: schedules", schedules); 

  return {
    assignedActions,
    pendingDeadline,
    meetingsThisWeek,
    attendanceRate,
    tasks,
    schedules,
  };
}