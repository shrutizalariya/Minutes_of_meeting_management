"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function DeleteEventAction(id: number) {
  try {
    // Delete related members first
    await prisma.eventmember.deleteMany({
      where: { EventID: id },
    });

    await prisma.events.delete({
      where: { EventID: id },
    });
    revalidatePath("/dashboard/admin/events");
  } catch (error) {
    console.error("Database Delete Error:", error);
    return { error: "Database Error: Failed to Delete Event." };
  }

  redirect("/dashboard/admin/events?success=Event+Deleted+Successfully");
}


