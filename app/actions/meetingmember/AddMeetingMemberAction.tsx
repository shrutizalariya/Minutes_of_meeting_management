"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function AddMeetingMemberAction(formData: FormData) {
  const meetingId = Number(formData.get("MeetingID"));
  const staffId = Number(formData.get("StaffID"));
  const isPresent = formData.get("IsPresent") === "on";
  const remarks = formData.get("Remarks") as string;

  if (!meetingId || !staffId) {
    throw new Error("Meeting and Staff are required");
  }

  await prisma.$transaction(async (tx) => {
    // 1. Create the meeting member record
    await tx.meetingmember.create({
      data: {
        MeetingID: meetingId,
        StaffID: staffId,
        IsPresent: isPresent,
        Remarks: remarks,
        Created: new Date(),
        Modified: new Date(),
      },
    });

    // 2. Fetch staff details to get UserID for notification
    const staff = await tx.staff.findUnique({
      where: { StaffID: staffId },
      select: { UserID: true }
    });

    // 3. Fetch meeting details for the notification message
    const meeting = await tx.meetings.findUnique({
      where: { MeetingID: meetingId },
      include: { meetingtype: true }
    });

    if (staff?.UserID && meeting) {
      // 4. Create personalized notification for the staff member
      await tx.notification.create({
        data: {
          UserID: staff.UserID,
          Type: "meeting",
          Title: "Assigned to Meeting",
          Message: `You have been added to: ${meeting.MeetingDescription || meeting.meetingtype.MeetingTypeName} scheduled for ${new Date(meeting.MeetingDate).toLocaleDateString()}`,
          Time: "Just now",
          Color: "blue",
          IsNew: true
        }
      });
    }
  });

  revalidatePath("/dashboard/admin/meetingmember");
  revalidatePath("/dashboard/staff/meetings");
  revalidatePath("/dashboard/staff/notifications");
  redirect("/dashboard/admin/meetingmember");
}
