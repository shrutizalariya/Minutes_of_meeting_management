"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function globalSearch(formData: FormData) {
    const query = formData.get("q")?.toString() || "";
    if (!query) return redirect("/dashboard/admin");

    const q = query.toLowerCase();

    // 1. Check Staff (Highest priority for names)
    const staffMatch = await prisma.staff.findFirst({
        where: {
            OR: [
                { StaffName: { contains: query } },
                { EmailAddress: { contains: query } },
                { MobileNo: { contains: query } }
            ]
        }
    });
    if (staffMatch) return redirect(`/dashboard/admin/staff?keyword=${encodeURIComponent(query)}`);

    // 2. Check Meetings (Priority for descriptions)
    const meetingMatch = await prisma.meetings.findFirst({
        where: {
            OR: [
                { MeetingDescription: { contains: query } },
                { Location: { contains: query } }
            ]
        }
    });
    if (meetingMatch) return redirect(`/dashboard/admin/meetings?keyword=${encodeURIComponent(query)}`);

    // 3. Check Events
    const eventMatch = await prisma.meetings.findFirst({
        where: {
            AND: [
                { Status: "Scheduled" },
                {
                    OR: [
                        { MeetingDescription: { contains: query } },
                        { Location: { contains: query } }
                    ]
                }
            ]
        }
    });
    if (eventMatch) return redirect(`/dashboard/admin/events?keyword=${encodeURIComponent(query)}`);

    // 4. Check Meeting Types
    const typeMatch = await prisma.meetingtype.findFirst({
        where: {
            MeetingTypeName: { contains: query }
        }
    });
    if (typeMatch) return redirect(`/dashboard/admin/meetingtype?keyword=${encodeURIComponent(query)}`);

    // Default: Fallback to Meetings or a general "results" view if we had one
    return redirect(`/dashboard/admin/meetings?keyword=${encodeURIComponent(query)}`);
}
