import { prisma } from "@/lib/prisma";

export async function getMeetingStatusStats() {

  const completed = await prisma.meetings.count({
    where: { Status: "Completed" }
  });

  const scheduled = await prisma.meetings.count({
    where: { 
      Status: "Scheduled",
      IsCancelled: false
    }
  });

  const cancelled = await prisma.meetings.count({
    where: { IsCancelled: true }
  });

  return [
    { name: "Completed", value: completed },
    { name: "Scheduled", value: scheduled },
    { name: "Cancelled", value: cancelled },
  ];
}