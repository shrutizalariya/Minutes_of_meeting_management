"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function EditMeetingAction(formData: FormData) {
  const idValue = formData.get("MeetingID");

  if (!idValue) throw new Error("Meeting ID is missing");

  const MeetingID = Number(idValue);
  if (isNaN(MeetingID)) throw new Error("Invalid Meeting ID");

  const MeetingDateStr = formData.get("MeetingDate") as string;
  const MeetingDate = new Date(MeetingDateStr);

  const MeetingTypeID = Number(formData.get("MeetingType"));
  if (isNaN(MeetingTypeID)) throw new Error("Invalid Meeting Type");

  const MeetingDescription =
    (formData.get("MeetingDescription") as string) || null;

  const DocumentPath =
    (formData.get("DocumentPath") as string) || null;

  const IsCancelled = formData.get("IsCancelled") === "on";

  const CancellationDateTimeStr =
    formData.get("CancellationDateTime") as string;

  const CancellationDateTime = CancellationDateTimeStr
    ? new Date(CancellationDateTimeStr)
    : null;

  const CancellationReason =
    (formData.get("CancellationReason") as string) || null;

  // Safety rule
  if (IsCancelled && (!CancellationDateTime || !CancellationReason)) {
    throw new Error("Cancellation date and reason are required");
  }

  await prisma.meetings.update({
    where: { MeetingID },
    data: {
      MeetingDate,
      MeetingTypeID,
      MeetingDescription,
      DocumentPath,
      IsCancelled,
      CancellationDateTime: IsCancelled ? CancellationDateTime : null,
      CancellationReason: IsCancelled ? CancellationReason : null,
    },
  });

  revalidatePath("/meetings");
  redirect("/meetings");
}
