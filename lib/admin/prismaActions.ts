// lib/meeting/prismaActions.ts
import { prisma } from "../prisma";

export type CriticalActionItem = {
  MeetingMemberID: number;
  IsPresent: boolean | null;
  Remarks: string | null;
  meetings: {  
    MeetingDate: Date;
    MeetingDescription: string | null;
    Status: string;
  };
  staff: {
    StaffName: string;
  };
};

export async function getCriticalActionItems(): Promise<CriticalActionItem[]> {
  return prisma.meetingmember.findMany({
    where: {
      OR: [
        { IsPresent: false },
        { meetings: { Status: "Scheduled" } },
      ],
    },
    include: {
      meetings: true,
      staff: true,
    },
    orderBy: {
      meetings: { MeetingDate: "asc" },
    },
    take: 10,
  });
}