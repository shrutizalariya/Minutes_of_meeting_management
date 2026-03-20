import { prisma } from "@/lib/prisma";

export type MeetingType = {
  MeetingTypeID: number;
  MeetingTypeName: string;
};

export type Meeting = {
  MeetingID: number;
  MeetingDate: string;
  MeetingDescription?: string;
  Location?: string;
  meetingtype?: MeetingType;
  category?: "Meeting" | "Event";
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
  category?: "Meeting" | "Event";
};

export type StaffDashboardData = {
  assignedActions: number;
  pendingDeadline: number;
  meetingsThisWeek: number;
  attendanceRate: number;
  tasks: MeetingMember[];
  schedules: Meeting[];
};

export type AttendanceRecord = {
  id: number;
  description: string;
  date: string;
  category: "Meeting" | "Event";
  isPresent: boolean;
  remarks: string;
};

export type MonthlyAttendance = {
  name: string;
  present: number;
  total: number;
  eventPresent: number;
  eventTotal: number;
  meetingPresent: number;
  meetingTotal: number;
};

export type StaffAttendanceData = {
  attendanceRate: number;
  totalPresent: number;
  totalAbsent: number;
  records: AttendanceRecord[];
  totalRecords: number;
  monthlyData: MonthlyAttendance[];
};

export async function getStaffDashboard(staffId: number): Promise<StaffDashboardData> {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  // 1. Fetch all assignments
  const meetingAssignments = await prisma.meetingmember.findMany({
    where: { StaffID: staffId },
    include: { meetings: { include: { meetingtype: true } } },
  });

  const eventAssignments = await prisma.eventmember.findMany({
    where: { StaffID: staffId },
    include: { events: { include: { eventtype: true } } },
  });

  // KPIs
  const assignedActions = meetingAssignments.length + eventAssignments.length;

  const pendingMeetings = meetingAssignments.filter(m => m.meetings?.Status === "Scheduled").length;
  const pendingEvents = eventAssignments.filter(e => e.events?.Status === "Scheduled").length;
  const pendingDeadline = pendingMeetings + pendingEvents;

  const meetingsThisWeekCount = meetingAssignments.filter(m => {
    if (!m.meetings) return false;
    const date = new Date(m.meetings.MeetingDate);
    return date >= today && date <= nextWeek;
  }).length;
  
  const eventsThisWeekCount = eventAssignments.filter(e => {
    if (!e.events) return false;
    const date = new Date(e.events.EventDate);
    return date >= today && date <= nextWeek;
  }).length;
  
  const meetingsThisWeek = meetingsThisWeekCount + eventsThisWeekCount;

  // Attendance
  const totalMeetingsForAttendance = meetingAssignments.length;
  const presentMeetings = meetingAssignments.filter(m => m.IsPresent).length;
  const totalEventsForAttendance = eventAssignments.length;
  const presentEvents = eventAssignments.filter(e => e.IsPresent).length;
  
  const totalAttendanceCount = totalMeetingsForAttendance + totalEventsForAttendance;
  const presentAttendanceCount = presentMeetings + presentEvents;
  const attendanceRate = totalAttendanceCount === 0 ? 0 : Math.round((presentAttendanceCount / totalAttendanceCount) * 100);

  // Tasks (latest 5 combined)
  const taskMeetings = meetingAssignments.map(t => ({
    MeetingMemberID: t.MeetingMemberID,
    MeetingID: t.MeetingID,
    StaffID: t.StaffID,
    IsPresent: t.IsPresent ?? undefined,
    Remarks: t.Remarks ?? undefined,
    Created: t.Created ?? undefined,
    Modified: t.Modified ?? undefined,
    category: "Meeting" as const,
    meetings: t.meetings ? {
      MeetingID: t.meetings.MeetingID,
      MeetingDate: t.meetings.MeetingDate.toISOString(),
      MeetingDescription: t.meetings.MeetingDescription ?? undefined,
      Location: t.meetings.Location ?? undefined,
      category: "Meeting" as const,
      meetingtype: t.meetings.meetingtype ? {
        MeetingTypeID: t.meetings.meetingtype.MeetingTypeID,
        MeetingTypeName: t.meetings.meetingtype.MeetingTypeName,
      } : undefined,
    } : undefined,
  }));

  const taskEvents = eventAssignments.map(t => ({
    MeetingMemberID: t.EventMemberID,
    MeetingID: t.EventID,
    StaffID: t.StaffID,
    IsPresent: t.IsPresent ?? undefined,
    Remarks: t.Remarks ?? undefined,
    Created: t.Created ?? undefined,
    Modified: t.Modified ?? undefined,
    category: "Event" as const,
    meetings: t.events ? {
      MeetingID: t.events.EventID,
      MeetingDate: t.events.EventDate.toISOString(),
      MeetingDescription: t.events.EventDescription ?? undefined,
      Location: t.events.Location ?? undefined,
      category: "Event" as const,
      meetingtype: t.events.eventtype ? {
        MeetingTypeID: t.events.eventtype.EventTypeID,
        MeetingTypeName: t.events.eventtype.EventTypeName,
      } : undefined,
    } : undefined,
  }));

  const tasks = [...taskMeetings, ...taskEvents]
    .sort((a, b) => new Date(b.Created || 0).getTime() - new Date(a.Created || 0).getTime())
    .slice(0, 5);

  // Upcoming schedules (next 5 combined)
  const schedMeetings = meetingAssignments
    .filter(m => m.meetings && new Date(m.meetings.MeetingDate) >= today)
    .map(m => ({
      MeetingID: m.meetings!.MeetingID,
      MeetingDate: m.meetings!.MeetingDate.toISOString(),
      MeetingDescription: m.meetings!.MeetingDescription ?? undefined,
      Location: m.meetings!.Location ?? undefined,
      category: "Meeting" as const,
      meetingtype: m.meetings!.meetingtype ? {
        MeetingTypeID: m.meetings!.meetingtype.MeetingTypeID,
        MeetingTypeName: m.meetings!.meetingtype.MeetingTypeName,
      } : undefined,
    }));

  const schedEvents = eventAssignments
    .filter(e => e.events && new Date(e.events.EventDate) >= today)
    .map(e => ({
      MeetingID: e.events!.EventID,
      MeetingDate: e.events!.EventDate.toISOString(),
      MeetingDescription: e.events!.EventDescription ?? undefined,
      Location: e.events!.Location ?? undefined,
      category: "Event" as const,
      meetingtype: e.events!.eventtype ? {
        MeetingTypeID: e.events!.eventtype.EventTypeID,
        MeetingTypeName: e.events!.eventtype.EventTypeName,
      } : undefined,
    }));

  const schedules = [...schedMeetings, ...schedEvents]
    .sort((a, b) => new Date(a.MeetingDate).getTime() - new Date(b.MeetingDate).getTime())
    .slice(0, 5);

  return {
    assignedActions,
    pendingDeadline,
    meetingsThisWeek,
    attendanceRate,
    tasks,
    schedules,
  };
}

export async function searchStaffData(staffId: number, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const meetingAssignments = await prisma.meetingmember.findMany({
    where: {
      StaffID: staffId,
      meetings: {
        OR: [
          { MeetingDescription: { contains: normalizedQuery } },
          { Location: { contains: normalizedQuery } },
        ]
      }
    },
    include: { meetings: { include: { meetingtype: true } } },
    take: 5
  });

  const eventAssignments = await prisma.eventmember.findMany({
    where: {
      StaffID: staffId,
      events: {
        OR: [
          { EventDescription: { contains: normalizedQuery } },
          { Location: { contains: normalizedQuery } },
        ]
      }
    },
    include: { events: { include: { eventtype: true } } },
    take: 5
  });

  return [
    ...meetingAssignments.map(m => ({
      id: m.MeetingMemberID,
      title: m.meetings?.MeetingDescription || "Untitled Meeting",
      category: "Meeting" as const,
      type: m.meetings?.meetingtype?.MeetingTypeName || "Standard",
    })),
    ...eventAssignments.map(e => ({
      id: e.EventMemberID,
      title: e.events?.EventDescription || "Untitled Event",
      category: "Event" as const,
      type: e.events?.eventtype?.EventTypeName || "Standard",
    }))
  ];
}

export async function getStaffAttendance(
  staffId: number, 
  page: number = 1, 
  pageSize: number = 10
): Promise<StaffAttendanceData> {
  const meetingAssignments = await prisma.meetingmember.findMany({
    where: { StaffID: staffId },
    include: { meetings: true },
  });

  const eventAssignments = await prisma.eventmember.findMany({
    where: { StaffID: staffId },
    include: { events: true },
  });

  const allRecords: AttendanceRecord[] = [
    ...meetingAssignments.map(m => ({
      id: m.MeetingMemberID,
      description: m.meetings?.MeetingDescription || "Untitled Meeting",
      date: m.meetings?.MeetingDate.toISOString() || "",
      category: "Meeting" as const,
      isPresent: !!m.IsPresent,
      remarks: m.Remarks || "No remarks",
    })),
    ...eventAssignments.map(e => ({
      id: e.EventMemberID,
      description: e.events?.EventDescription || "Untitled Event",
      date: e.events?.EventDate.toISOString() || "",
      category: "Event" as const,
      isPresent: !!e.IsPresent,
      remarks: e.Remarks || "No remarks",
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalRecords = allRecords.length;
  const records = allRecords.slice((page - 1) * pageSize, page * pageSize);

  const totalPresent = allRecords.filter(r => r.isPresent).length;
  const totalAbsent = allRecords.length - totalPresent;
  const attendanceRate = allRecords.length === 0 ? 0 : Math.round((totalPresent / allRecords.length) * 100);

  // Calculate Monthly Data for Chart (Last 6 months)
  const monthlyData: MonthlyAttendance[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = month.toLocaleString('default', { month: 'short' });
    
    const monthRecords = allRecords.filter(r => {
      const d = new Date(r.date);
      return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
    });

    const eventRecords = monthRecords.filter(r => r.category === "Event");
    const meetingRecords = monthRecords.filter(r => r.category === "Meeting");

    monthlyData.push({
      name: monthName,
      present: monthRecords.filter(r => r.isPresent).length,
      total: monthRecords.length,
      eventPresent: eventRecords.filter(r => r.isPresent).length,
      eventTotal: eventRecords.length,
      meetingPresent: meetingRecords.filter(r => r.isPresent).length,
      meetingTotal: meetingRecords.length,
    });
  }

  return {
    attendanceRate,
    totalPresent,
    totalAbsent,
    records,
    totalRecords,
    monthlyData,
  };
}