"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function DeleteMeetingAction(id: number) {
  let isSuccessful = false;

  try {
    await prisma.meetings.delete({
      where: { MeetingID: id }
    });
    isSuccessful = true;
  } catch (error) {
    console.error("Database Delete Error:", error);
    // You could return an error object here if you want to show a toast in the UI
    return { message: "Database Error: Failed to Delete Meeting." };
  }

  if (isSuccessful) {
    revalidatePath("/dashboard/admin/meetings");
    redirect("/dashboard/admin/meetings");
  }
}