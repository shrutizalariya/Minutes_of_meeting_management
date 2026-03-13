"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const id = Number(formData.get("id"));
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();

    // Toggles might come as "on" or missing from form if checkboxes
    const emailNotif = formData.get("emailNotifications") === "on";
    const desktopAlerts = formData.get("desktopAlerts") === "on";

    if (!id || !name || !email) {
        return { success: false, error: "Missing required fields." };
    }

    try {
        await prisma.users.update({
            where: { Id: id },
            data: {
                Name: name,
                Email: email,
                EmailNotifications: emailNotif,
                DesktopAlerts: desktopAlerts,
            },
        });

        revalidatePath("/dashboard/admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Update profile error:", error);
        return { success: false, error: "Failed to update profile." };
    }
}

export async function getUserSettings(id: number) {
    try {
        let user = await prisma.users.findUnique({
            where: { Id: id },
            select: {
                Id: true,
                Name: true,
                Email: true,
                EmailNotifications: true,
                DesktopAlerts: true,
            }
        });

        if (!user) {
            // Pick first user as fallback for demo
            user = await prisma.users.findFirst({
                select: {
                    Id: true,
                    Name: true,
                    Email: true,
                    EmailNotifications: true,
                    DesktopAlerts: true,
                }
            });
        }

        return user;
    } catch (e) {
        console.error("Fetch user settings error:", e);
        return null;
    }
}
