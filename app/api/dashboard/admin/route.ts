import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  const totalMeetings = await prisma.meetings.count();

  const totalStaff = await prisma.staff.count();

  const pendingMeetings = await prisma.meetings.count({
    where: {
      Status: "Scheduled"
    }
  });

  const completedMeetings = await prisma.meetings.count({
    where: {
      Status: "Completed"
    }
  });

  const completedPercentage =
    totalMeetings === 0
      ? 0
      : Math.round((completedMeetings / totalMeetings) * 100);

  return NextResponse.json({
    totalMeetings,
    totalStaff,
    pendingMeetings,
    completedPercentage
  });
}