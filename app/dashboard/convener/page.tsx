import React from "react";
import { prisma } from "@/lib/prisma";
import ConvenerDashboardClient from "./ConvenerDashboardClient";

export default async function ConvenerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ chartMonth?: string; chartYear?: string }>;
}) {
  const params = await searchParams;
  const chartMonth = Number(params?.chartMonth || new Date().getMonth() + 1);
  const chartYear = Number(params?.chartYear || new Date().getFullYear());

  // Fetch KPI Data
  const totalMeetings = await prisma.meetings.count();
  
  const upcomingMeetingsCount = await prisma.meetings.count({
    where: {
      MeetingDate: { gt: new Date() },
      IsCancelled: false,
    }
  });

  const cancelledMeetingsCount = await prisma.meetings.count({
    where: { IsCancelled: true }
  });

  const totalStaff = await prisma.staff.count();

  // Fetch Upcoming Meetings for the table
  const upcomingMeetings = await prisma.meetings.findMany({
    where: {
      MeetingDate: { gt: new Date() },
      IsCancelled: false,
    },
    include: {
      meetingtype: true,
      meetingmember: true,
    },
    orderBy: {
      MeetingDate: "asc",
    },
    take: 10,
  });

  // Fetch Meeting Types for Filters
  const meetingTypes = await prisma.meetingtype.findMany();

  // Fetch Notifications
  const notifications = await prisma.notification.findMany({
    where: { Type: "Meeting" },
    orderBy: { CreatedAt: "desc" },
    take: 5,
  });

  // Fetch Attendance Data for Chart for the selected month/year
  const startDate = new Date(chartYear, chartMonth - 1, 1);
  const endDate = new Date(chartYear, chartMonth, 0);

  const monthMeetings = await prisma.meetings.findMany({
    where: { 
      Status: "Completed",
      MeetingDate: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: { MeetingDate: "asc" },
    include: {
      meetingmember: true,
    },
  });

  const chartData = monthMeetings.map(m => {
    const present = m.meetingmember.filter(mm => mm.IsPresent).length;
    const absent = m.meetingmember.filter(mm => !mm.IsPresent).length;
    return {
      name: new Date(m.MeetingDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
      present,
      absent,
    };
  });

  // Initial Data for Client Component
  const initialData = {
    kpis: {
      total: totalMeetings,
      upcoming: upcomingMeetingsCount,
      cancelled: cancelledMeetingsCount,
      staff: totalStaff,
    },
    meetings: upcomingMeetings.map(m => ({
      id: m.MeetingID,
      type: m.meetingtype.MeetingTypeName,
      date: m.MeetingDate,
      location: m.Location || "N/A",
      status: m.Status,
      memberCount: m.meetingmember.length,
    })),
    meetingTypes: meetingTypes.map(mt => mt.MeetingTypeName),
    notifications: notifications.map(n => ({
      id: n.Id,
      title: n.Title,
      message: n.Message,
      time: n.Time,
      isNew: n.IsNew,
    })),
    chartData,
    chartMonth,
    chartYear,
  };

  return <ConvenerDashboardClient initialData={initialData} />;
}
