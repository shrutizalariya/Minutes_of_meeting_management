"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function BulkDeleteEventsAction(ids: number[]) {
  try {
    await prisma.events.deleteMany({
      where: {
        EventID: { in: ids },
      },
    });
    revalidatePath("/dashboard/admin/events");
    return { success: true };
  } catch (error) {
    console.error("Bulk Delete Events Error:", error);
    return { success: false };
  }
}
