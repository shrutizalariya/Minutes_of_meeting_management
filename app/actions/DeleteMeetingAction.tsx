"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function DeleteMeetingAction(id: number) {
  let isSuccessful = false;

    try {
        // Delete related records first due to foreign key constraints
        await prisma.meetingmember.deleteMany({
            where: { MeetingID: id }
        });

        await prisma.meetings.delete({
            where: { MeetingID: id }
        });
        isSuccessful = true;
    } catch (error) {
        console.error("Database Delete Error:", error);
        return { success: false, error: "Database Error: Failed to Delete Meeting." };
    }

  if (isSuccessful) {
    revalidatePath("/dashboard/admin/meetings");
    redirect("/dashboard/admin/meetings?success=Meeting+Deleted+Successfully");
  }
}