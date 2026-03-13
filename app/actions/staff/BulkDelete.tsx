"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function BulkDeleteStaffAction(ids: number[]) {
    try {
        await prisma.staff.deleteMany({
            where: {
                StaffID: { in: ids },
            },
        });
        revalidatePath("/dashboard/admin/staff");
        return { success: true };
    } catch (error) {
        console.error("Bulk Delete Staff Error:", error);
        return { success: false };
    }
}
