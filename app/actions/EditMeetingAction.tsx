// "use server";

// import { prisma } from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

// export async function EditMeetingAction(formData: FormData) {
//   const idValue = formData.get("MeetingID");

//   if (!idValue) throw new Error("Meeting ID is missing");

//   const MeetingID = Number(idValue);
//   if (isNaN(MeetingID)) throw new Error("Invalid Meeting ID");

//   const MeetingDateStr = formData.get("MeetingDate") as string;
//   const MeetingDate = new Date(MeetingDateStr);

//   const MeetingTypeID = Number(formData.get("MeetingType"));
//   if (isNaN(MeetingTypeID)) throw new Error("Invalid Meeting Type");

//   const MeetingDescription =
//     (formData.get("MeetingDescription") as string) || null;

//     // For file input
//   const file = formData.get("DocumentPath") as File | null;
//   let DocumentPath: string | null = null;

//   if (file && file.size > 0) {
//     // Upload your file somewhere (e.g., local server or cloud) and get the URL/path
//     DocumentPath = `/uploads/${file.name}`; // Example path
//   } else {
//     DocumentPath = null; // No file uploaded
//   }


//   const IsCancelled = formData.get("IsCancelled") === "on";

//   const CancellationDateTimeStr =
//     formData.get("CancellationDateTime") as string;

//   const CancellationDateTime = CancellationDateTimeStr
//     ? new Date(CancellationDateTimeStr)
//     : null;

//   const CancellationReason =
//     (formData.get("CancellationReason") as string) || null;

//   // Safety rule
//   if (IsCancelled && (!CancellationDateTime || !CancellationReason)) {
//     throw new Error("Cancellation date and reason are required");
//   }

//   await prisma.meetings.update({
//     where: { MeetingID },
//     data: {
//       MeetingDate,
//       MeetingTypeID,
//       MeetingDescription,
//       DocumentPath,
//       IsCancelled,
//       CancellationDateTime: IsCancelled ? CancellationDateTime : null,
//       CancellationReason: IsCancelled ? CancellationReason : null,
//     },
//   });

//   revalidatePath("/meetings");
//   redirect("/meetings");
// }
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function EditMeetingAction(formData: FormData) {

  const MeetingID = Number(formData.get("MeetingID"));

  const MeetingDate = new Date(
    formData.get("MeetingDate") as string
  );

  const MeetingTypeID = Number(
    formData.get("MeetingType")
  );

  if (isNaN(MeetingTypeID)) {
    throw new Error("Meeting Type not selected");
  }

  const MeetingDescription =
    formData.get("MeetingDescription") as string;

  const file =
    formData.get("DocumentPath") as File;

  const oldDoc =
    formData.get("OldDocumentPath") as string;

  let DocumentPath = oldDoc;

  if (file && file.size > 0) {
    DocumentPath = `/uploads/${file.name}`;
  }

  await prisma.meetings.update({
    where: { MeetingID },
    data: {
      MeetingDate,
      MeetingTypeID,
      MeetingDescription,
      DocumentPath
    }
  });

  revalidatePath("/dashboard/admin/meetings");

  redirect("/dashboard/admin/meetings");
}