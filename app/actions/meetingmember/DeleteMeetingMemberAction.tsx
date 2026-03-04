"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function DeleteMeetingMemberAction(id:number){
    await prisma.meetingmember.delete({where:{MeetingMemberID:id}});
    revalidatePath("/meetingmember");
    redirect("/meetingmember");
}

export {DeleteMeetingMemberAction};