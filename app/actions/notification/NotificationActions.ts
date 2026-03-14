"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotifications(userId?: number) {
    try {
        const where: any = {};
        if (userId) {
            where.OR = [
                { UserID: userId },
                { UserID: null } // Global notifications
            ];
        }
        return await prisma.notification.findMany({
            where,
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
        revalidatePath("/dashboard/staff");
        revalidatePath("/dashboard/staff/notifications");
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
        revalidatePath("/dashboard/staff");
        revalidatePath("/dashboard/staff/notifications");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function markAllAsRead(userId?: number) {
    try {
        const where: any = { IsNew: true };
        if (userId) {
            where.OR = [
                { UserID: userId },
                { UserID: null }
            ];
        }
        await prisma.notification.updateMany({
            where,
            data: { IsNew: false }
        });
        revalidatePath("/dashboard/admin/notifications");
        revalidatePath("/dashboard/staff");
        revalidatePath("/dashboard/staff/notifications");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function getBellStatus() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return { showDot: false };

        const payload = await verifyToken(token) as { id: number; email: string; role: string };
        if (!payload || !payload.id) return { showDot: false };

        const user = await prisma.users.findUnique({
            where: { Id: payload.id },
            select: { DesktopAlerts: true }
        });

        if (!user?.DesktopAlerts) return { showDot: false };

        const unreadCount = await prisma.notification.count({
            where: { 
                IsNew: true,
                OR: [
                    { UserID: payload.id },
                    { UserID: null }
                ]
            }
        });

        return { showDot: unreadCount > 0 };
    } catch (error) {
        return { showDot: false };
    }
}
