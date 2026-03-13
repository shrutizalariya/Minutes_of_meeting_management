"use server";

import { revalidatePath } from "next/cache";

export async function sendAttendanceAlert(staffID: number, staffName: string, staffEmail: string) {
    // Simulating an email send with a delay
    console.log(`Sending attendance alert email to: ${staffName} <${staffEmail}> (ID: ${staffID})`);

    // In a real application, you might use:
    // await resend.emails.send({ from: 'alerts@mom.com', to: staffEmail, ... });

    await new Promise((resolve) => setTimeout(resolve, 800));

    revalidatePath("/dashboard/admin/staffAttendance");
    return { success: true };
}
