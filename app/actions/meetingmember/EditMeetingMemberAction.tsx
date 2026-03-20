"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function EditMeetingMemberAction(formData: FormData) {
  const id = Number(formData.get("MeetingMemberID"));
  const staffId = Number(formData.get("StaffID"));
  const isPresent = formData.get("IsPresent") === "on";
  const remarks = formData.get("Remarks") as string;
  const meetingId = Number(formData.get("MeetingID"));

  if (!id || !staffId) {
    throw new Error("Invalid data");
  }

  await prisma.meetingmember.update({
    where: {
      MeetingMemberID: id,
    },
    data: {
      StaffID: staffId,
      IsPresent: isPresent,
      Remarks: remarks,
      Modified: new Date(),
    },
  });

  // Notify Meeting Conveners if staff is absent
  if (!isPresent && meetingId) {
    const conveners = await prisma.users.findMany({
      where: { Role: "Meeting Convener" },
      select: { Id: true }
    });

    const meeting = await prisma.meetings.findUnique({
      where: { MeetingID: meetingId },
      include: { meetingtype: true }
    });

    const staffName = await prisma.staff.findUnique({
      where: { StaffID: staffId },
      select: { StaffName: true }
    });

    if (meeting && staffName) {
      await Promise.all(conveners.map(c => 
        prisma.notification.create({
          data: {
            UserID: c.Id,
            Type: "alert",
            Title: "Staff Absentee Alert (Update)",
            Message: `${staffName.StaffName} was marked ABSENT for ${meeting.MeetingDescription || meeting.meetingtype.MeetingTypeName}`,
            Time: "Just now",
            Color: "rose",
            IsNew: true
          }
        })
      ));
    }
  }

  revalidatePath("/dashboard/admin/meetingmember");
  revalidatePath("/dashboard/convener/staff");
  revalidatePath("/dashboard/convener/meetings");
  
  const redirectTo = formData.get("redirectTo") as string;
  const target = redirectTo || "/dashboard/admin/meetingmember";
  const separator = target.includes("?") ? "&" : "?";
  redirect(`${target}${separator}success=Member+Record+Updated+Successfully`);
}
