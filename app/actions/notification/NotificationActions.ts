"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
    try {
        return await prisma.notification.findMany({
            orderBy: { CreatedAt: 'desc' },
            take: 50
        });
    } catch (error) {
        console.error("Get notifications error:", error);
        return [];
    }
}

export async function clearNotifications() {
    try {
        await prisma.notification.deleteMany({});
        revalidatePath("/dashboard/admin/notifications");
        return { success: true };
    } catch (error) {
        console.error("Clear notifications error:", error);
        return { success: false };
    }
}

export async function markAsRead(id: number) {
    try {
        await prisma.notification.update({
            where: { Id: id },
            data: { IsNew: false }
        });
        revalidatePath("/dashboard/admin/notifications");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function markAllAsRead() {
    try {
        await prisma.notification.updateMany({
            where: { IsNew: true },
            data: { IsNew: false }
        });
        revalidatePath("/dashboard/admin/notifications");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}
