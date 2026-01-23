import { prisma } from "@/lib/prisma";
import EditMeetingForm from "./EditMeetingForm";

export default async function EditMeeting({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const {id} = await params;
  const data = await prisma.meetings.findFirst({
    where: { MeetingID: Number(id) },
    include: { meetingtype: true },
  });

  const meetingTypes = await prisma.meetingtype.findMany();

  if (!data) {
    return <p className="text-center mt-10">Meeting not found</p>;
  }

  return (
    <EditMeetingForm
      meeting={data}
      meetingTypes={meetingTypes}
    />
  );
}
