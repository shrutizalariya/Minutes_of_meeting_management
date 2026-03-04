import { prisma } from "@/lib/prisma";

export async function getNotifications() {

  return prisma.meetings.findMany({

    where: {

      MeetingDate: {
        lte: new Date(
          Date.now() + 86400000
        )
      },

      Status: "Scheduled"
    },

    orderBy: {
      MeetingDate: "asc"
    },

    take: 5
  });
}