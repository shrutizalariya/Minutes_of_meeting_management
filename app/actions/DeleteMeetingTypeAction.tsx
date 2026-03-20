"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function DeleteMeetingTypeAction(id: number) {
    try {
        const meetingCount = await prisma.meetings.count({
            where: { MeetingTypeID: id }
        });

        if (meetingCount > 0) {
            return { error: "Cannot delete Meeting Type that is currently assigned to meetings." };
        }

        await prisma.meetingtype.delete({ where: { MeetingTypeID: id } });
        revalidatePath("/dashboard/admin/meetingtype");
    } catch (error) {
        return { error: "Database Error: Failed to Delete Meeting Type." };
    }
    
    redirect("/dashboard/admin/meetingtype?success=Meeting+Type+Deleted+Successfully");
}