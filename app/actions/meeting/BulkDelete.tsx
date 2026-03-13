"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function BulkDeleteMeetingsAction(ids: number[]) {
  try {
    await prisma.meetings.deleteMany({
      where: {
        MeetingID: { in: ids },
      },
    });
    revalidatePath("/dashboard/admin/meetings");
    return { success: true };
  } catch (error) {
    console.error("Bulk Delete Meetings Error:", error);
    return { success: false };
  }
}