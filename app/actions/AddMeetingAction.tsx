"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function AddMeetingAction(formData: FormData) {
  // Required fields
  const MeetingDateStr = formData.get("MeetingDate") as string;
  const MeetingTypeIDStr = formData.get("MeetingTypeID") as string;

  if (!MeetingDateStr || !MeetingTypeIDStr) {
    throw new Error("Meeting Date and Meeting Type are required");
  }

  const MeetingDate = new Date(MeetingDateStr);
  const MeetingTypeID = Number(MeetingTypeIDStr);

  if (isNaN(MeetingTypeID)) {
    throw new Error("Invalid Meeting Type");
  }

  const MeetingDescription = (formData.get("MeetingDescription") as string);
  const DocumentPath = (formData.get("DocumentPath") as string) || null;
  const IsCancelled = formData.get("IsCancelled") === "on" ? true : false;
  const CancellationDateTimeStr = formData.get("CancellationDateTime") as string;
  const CancellationDateTime = CancellationDateTimeStr ? new Date(CancellationDateTimeStr) : null;
  const CancellationReason = (formData.get("CancellationReason") as string) || null;

 const data = {MeetingDate, MeetingTypeID, MeetingDescription, DocumentPath, IsCancelled, CancellationDateTime, CancellationReason};

  // Create the meeting record
  await prisma.meetings.create({ data });

  revalidatePath("/meetings");
  redirect("/meetings");
}
