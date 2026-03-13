"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function BulkDeleteMeetingTypesAction(ids: number[]) {
    try {
        await prisma.meetingtype.deleteMany({
            where: {
                MeetingTypeID: { in: ids },
            },
        });
        revalidatePath("/dashboard/admin/meetingtype");
        return { success: true };
    } catch (error) {
        console.error("Bulk Delete Meeting Types Error:", error);
        return { success: false };
    }
}
