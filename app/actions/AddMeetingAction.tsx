"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export async function AddMeetingAction(formData: FormData) {
  const MeetingDate = formData.get("MeetingDate") as string;
  const MeetingTypeID = Number(formData.get("MeetingTypeID"));
  const MeetingDescription = formData.get("MeetingDescription") as string | null;
  const file = formData.get("DocumentPath") as File | null;

  let DocumentPath: string | null = null;



  if (file && file.size > 0) {
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const uploadDir = path.join(
      process.cwd(),
      "public/uploads/meeting_docs"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, buffer);

    // Public path to store in DB
    DocumentPath = `/uploads/meeting_docs/${file.name}`;
  }

  const meeting = await prisma.meetings.create({
    data: {
      MeetingDate: new Date(MeetingDate),
      MeetingTypeID,
      MeetingDescription,
      DocumentPath,
      IsCancelled: false, // default
    },
  });

  // Create notification for the new meeting - Targeted at all Meeting Conveners
  const conveners = await prisma.users.findMany({
    where: { Role: "Meeting Convener" },
    select: { Id: true }
  });

  await Promise.all(conveners.map(c => 
    prisma.notification.create({
      data: {
        UserID: c.Id,
        Type: "meeting",
        Title: "New Facilitation Assigned",
        Message: `New meeting: ${MeetingDescription || "Untitled"} set for ${new Date(MeetingDate).toLocaleDateString()}`,
        Time: "Just now",
        Color: "blue",
        IsNew: true
      }
    })
  ));

  revalidatePath("/dashboard/admin/notifications");
  revalidatePath("/dashboard/admin/meetings");
  revalidatePath("/dashboard/convener/meetings");

  const redirectTo = formData.get("redirectTo") as string;
  const target = redirectTo || "/dashboard/admin/meetings";
  const separator = target.includes("?") ? "&" : "?";
  redirect(`${target}${separator}success=Meeting+Scheduled+Successfully`);
}