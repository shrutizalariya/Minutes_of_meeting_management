"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import bcrypt from "bcryptjs";

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

        if (!user) {
            return { success: false, error: "User not found." };
        }

        // Verify current password with bcrypt
        const isCorrect = await bcrypt.compare(currentPassword, user.Password);
        if (!isCorrect) {
            return { success: false, error: "Incorrect current password." };
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.users.update({
            where: { Id: id },
            data: { Password: hashedPassword }
        });

        revalidatePath("/dashboard/admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Update security error:", error);
        return { success: false, error: "Failed to update security settings." };
    }
}
