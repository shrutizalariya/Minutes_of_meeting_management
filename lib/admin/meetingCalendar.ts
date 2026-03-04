import { prisma } from "@/lib/prisma";

export async function getMeetingsForCalendar() {
  return prisma.meetings.findMany({
    orderBy: {
      MeetingDate: "asc",
    },
    take: 100, // last 100 meetings
  });
}