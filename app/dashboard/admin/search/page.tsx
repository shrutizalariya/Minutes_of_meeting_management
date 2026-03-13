import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SearchRedirect({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const params = await searchParams;
    const query = params.q?.trim() || "";

    if (!query) {
        return redirect("/dashboard/admin");
    }

    const q = query.toLowerCase();

    // 1. Check Staff (Name, Email, Mobile)
    const staffMatch = await prisma.staff.findFirst({
        where: {
            OR: [
                { StaffName: { contains: query } },
                { EmailAddress: { contains: query } },
                { MobileNo: { contains: query } },
            ],
        },
        select: { StaffID: true },
    });
    if (staffMatch) {
        return redirect(`/dashboard/admin/staff?keyword=${encodeURIComponent(query)}`);
    }

    // 2. Check Meeting Types
    const typeMatch = await prisma.meetingtype.findFirst({
        where: {
            MeetingTypeName: { contains: query },
        },
        select: { MeetingTypeID: true },
    });
    if (typeMatch) {
        return redirect(`/dashboard/admin/meetingtype?keyword=${encodeURIComponent(query)}`);
    }

    // 3. Check Meetings / Events (Status check for Events)
    const meetingMatch = await prisma.meetings.findFirst({
        where: {
            OR: [
                { MeetingDescription: { contains: query } },
                { Location: { contains: query } },
            ],
        },
        select: { MeetingID: true, Status: true },
    });

    if (meetingMatch) {
        // If it's explicitly Scheduled, maybe go to Events? 
        // Usually "Meetings" is the primary source of truth.
        return redirect(`/dashboard/admin/meetings?keyword=${encodeURIComponent(query)}`);
    }

    // Fallback to Meetings search
    return redirect(`/dashboard/admin/meetings?keyword=${encodeURIComponent(query)}`);
}
