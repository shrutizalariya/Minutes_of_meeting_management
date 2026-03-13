"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function DeleteMeetingTypeAction(id:number){
    await prisma.meetingtype.delete({where:{MeetingTypeID:id}});
    revalidatePath("/dashboard/admin/meetingtype");
    redirect("/dashboard/admin/meetingtype");
}

export {DeleteMeetingTypeAction};