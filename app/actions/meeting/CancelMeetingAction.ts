"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

    revalidatePath("/dashboard/convener/meetings");
    revalidatePath("/dashboard/convener/archive");
    revalidatePath("/dashboard/admin/meetings");

    return { success: true };
  } catch (error) {
    console.error("Cancel meeting error:", error);
    return { success: false, error: "Failed to cancel meeting" };
  }
}
