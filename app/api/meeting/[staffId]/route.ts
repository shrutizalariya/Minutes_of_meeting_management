import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ staffId: string }> }
) {

  const resolvedParams = await params;
  const staffId = Number(resolvedParams.staffId);

  const meetings = await prisma.meetings.findMany({
    where: {
      meetingmember: {
        some: {
          StaffID: staffId
        }
      }
    },
    include: {
      meetingtype: true
    },
    orderBy: {
      MeetingDate: "asc"
    },
    take: 5
  });

  return NextResponse.json(meetings);
}
