"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function BulkDeleteMeetingsAction(ids: number[]) {
    try {
        // Handle constraint: delete members first
        await prisma.meetingmember.deleteMany({
            where: { MeetingID: { in: ids } }
        });

        await prisma.meetings.deleteMany({
            where: {
                MeetingID: { in: ids },
            },
        });
        revalidatePath("/dashboard/admin/meetings");
        return { success: true, message: `${ids.length} meetings deleted successfully.` };
    } catch (error) {
    console.error("Bulk Delete Meetings Error:", error);
    return { success: false };
  }
}