"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function BulkDeleteMeetingMembersAction(ids: number[]) {
    try {
        await prisma.meetingmember.deleteMany({
            where: {
                MeetingMemberID: { in: ids },
            },
        });
        revalidatePath("/dashboard/admin/meetingmember");
        return { success: true };
    } catch (error) {
        console.error("Bulk Delete Meeting Members Error:", error);
        return { success: false };
    }
}
