"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function AddMeetingMemberAction(formData: FormData) {
  const meetingId = Number(formData.get("MeetingID"));
  const staffId = Number(formData.get("StaffID"));
  const isPresent = formData.get("IsPresent") === "on";
  const remarks = formData.get("Remarks") as string;

  if (!meetingId || !staffId) {
    throw new Error("Meeting and Staff are required");
  }

  await prisma.meetingmember.create({
    data: {
      MeetingID: meetingId,
      StaffID: staffId,
      IsPresent: isPresent,
      Remarks: remarks,
      Created: new Date(),
      Modified: new Date(),
    },
  });

  revalidatePath("/meetingmember");
  redirect("/meetingmember");
}


