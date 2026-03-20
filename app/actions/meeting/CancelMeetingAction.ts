"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function CancelMeetingAction(meetingId: number, reason: string) {
  try {
    await prisma.meetings.update({
      where: { MeetingID: meetingId },
      data: {
        IsCancelled: true,
        Status: "Cancelled",
        CancellationDateTime: new Date(),
        CancellationReason: reason || "No reason provided",
      },
    });

    // Notify Members and Conveners
    const members = await prisma.meetingmember.findMany({
      where: { MeetingID: meetingId },
      include: { staff: true }
    });

    const conveners = await prisma.users.findMany({
      where: { Role: "Meeting Convener" },
      select: { Id: true }
    });

    const meeting = await prisma.meetings.findUnique({
      where: { MeetingID: meetingId },
      include: { meetingtype: true }
    });

    if (meeting) {
      const userIdsToNotify = new Set<number>();
      
      // Add staff UserIDs
      members.forEach(m => {
        if (m.staff.UserID) userIdsToNotify.add(m.staff.UserID);
      });

      // Add all conveners
      conveners.forEach(c => userIdsToNotify.add(c.Id));

      await Promise.all(Array.from(userIdsToNotify).map(userId => 
        prisma.notification.create({
          data: {
            UserID: userId,
            Type: "cancellation",
            Title: "Meeting Cancelled",
            Message: `The meeting "${meeting.MeetingDescription || meeting.meetingtype.MeetingTypeName}" has been cancelled. Reason: ${reason || "No reason provided"}`,
            Time: "Just now",
            Color: "rose",
            IsNew: true
          }
        })
      ));
    }

    revalidatePath("/dashboard/convener/meetings");
    revalidatePath("/dashboard/convener");
    revalidatePath("/dashboard/admin/meetings");
    return { success: true };
  } catch (error) {
    console.error("Cancel meeting error:", error);
    return { success: false, error: "Failed to cancel meeting" };
  }
}
