"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function EditMeetingMemberAction(formData: FormData) {
  const id = Number(formData.get("MeetingMemberID"));
  const staffId = Number(formData.get("StaffID"));
  const isPresent = formData.get("IsPresent") === "on";
  const remarks = formData.get("Remarks") as string;

  if (!id || !staffId) {
    throw new Error("Invalid data");
  }

  await prisma.meetingmember.update({
    where: {
      MeetingMemberID: id,
    },
    data: {
      StaffID: staffId,
      IsPresent: isPresent,
      Remarks: remarks,
      Modified: new Date(),
    },
  });

  revalidatePath("/meetingmember");
  redirect("/meetingmember");
}
