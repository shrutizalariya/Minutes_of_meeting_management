"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function globalSearch(formData: FormData) {
    const query = formData.get("q")?.toString() || "";
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    let roleBase = "/dashboard/admin";
    if (token) {
        const payload: any = await verifyToken(token);
        if (payload?.role === "convener") roleBase = "/dashboard/convener";
        else if (payload?.role === "staff") roleBase = "/dashboard/staff";
    }

    if (!query) return redirect(roleBase);

    // 1. Check Staff
    const staffMatch = await prisma.staff.findFirst({
        where: {
            OR: [
                { StaffName: { contains: query } },
                { EmailAddress: { contains: query } },
                { MobileNo: { contains: query } }
            ]
        }
    });

    // 2. Check Meetings
    const meetingMatch = await prisma.meetings.findFirst({
        where: {
            OR: [
                { MeetingDescription: { contains: query } },
                { Location: { contains: query } }
            ]
        }
    });

    // Dynamic Redirection based on match type
    if (staffMatch && !meetingMatch) {
        return redirect(`${roleBase}/staff?keyword=${encodeURIComponent(query)}`);
    } else if (meetingMatch) {
        return redirect(`${roleBase}/meetings?keyword=${encodeURIComponent(query)}`);
    }

    // Default: Fallback to Meetings or a search results page
    return redirect(`${roleBase}/meetings?keyword=${encodeURIComponent(query)}`);
}
