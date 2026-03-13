"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSecurity(formData: FormData) {
    const id = Number(formData.get("id"));
    const currentPassword = formData.get("currentPassword")?.toString();
    const newPassword = formData.get("newPassword")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    if (!id || !currentPassword || !newPassword || !confirmPassword) {
        return { success: false, error: "All password fields are required." };
    }

    if (newPassword !== confirmPassword) {
        return { success: false, error: "New passwords do not match." };
    }

    try {
        // Find user to verify current password
        const user = await prisma.users.findUnique({
            where: { Id: id }
        });

        if (!user || user.Password !== currentPassword) {
            return { success: false, error: "Incorrect current password." };
        }

        // Update password (in a real app, hash this!)
        await prisma.users.update({
            where: { Id: id },
            data: { Password: newPassword }
        });

        revalidatePath("/dashboard/admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Update security error:", error);
        return { success: false, error: "Failed to update security settings." };
    }
}
