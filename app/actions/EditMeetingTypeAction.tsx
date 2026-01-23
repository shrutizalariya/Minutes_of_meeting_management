"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function EditMeetingTypeAction(formData: FormData) {
  const idValue = formData.get("MeetingTypeID");

  if (!idValue) {
    throw new Error("MeetingType ID is missing");
  }

  const id = Number(idValue);

  if (isNaN(id)) {
    throw new Error("Invalid MeetingType ID");
  }

  const meetingtypename = formData.get("MeetingTypeName") as string;
  const remarks = formData.get("Remarks") as string;

  await prisma.meetingtype.update({
    where: {
      MeetingTypeID: id,
    },
    data: {
      MeetingTypeName: meetingtypename,
      Remarks: remarks,
    },
  });

  revalidatePath("/meetingtype");
  redirect("/meetingtype");
}

export { EditMeetingTypeAction };
