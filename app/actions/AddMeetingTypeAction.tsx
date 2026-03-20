"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function AddMeetingTypeAction(formData: FormData){
// console.log(formData)
const MeetingTypeName = formData.get("MeetingTypeName") as string;
const Remarks = formData.get("Remarks") as string;
const data = {MeetingTypeName , Remarks};
await prisma.meetingtype.create({data});
revalidatePath("/dashboard/admin/meetingtype");
redirect("/dashboard/admin/meetingtype?success=Meeting+Type+Added+Successfully");
}

export {AddMeetingTypeAction};