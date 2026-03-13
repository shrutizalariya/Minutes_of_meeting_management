"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function DeleteEventAction(id: number) {
  let isSuccessful = false;

  try {
    await prisma.events.delete({
      where: { EventID: id },
    });
    isSuccessful = true;
  } catch (error) {
    console.error("Database Delete Error:", error);
    return { message: "Database Error: Failed to Delete Event." };
  }

  if (isSuccessful) {
    revalidatePath("/dashboard/admin/events");
    redirect("/dashboard/admin/events");
  }
}


