"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function DeleteMeetingAction(id:number){
    await prisma.meetings.delete({where:{MeetingID:id}});
    revalidatePath("/meetings");
    redirect("/meetings");
}

export {DeleteMeetingAction};