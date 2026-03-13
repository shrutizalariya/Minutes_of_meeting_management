"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";

export async function EditEventAction(formData: FormData) {
  const EventID = Number(formData.get("EventID"));
  const EventDate = new Date(formData.get("EventDate") as string);
  const EventTypeID = Number(formData.get("EventType"));

  if (isNaN(EventTypeID)) {
    throw new Error("Event Type not selected");
  }

  const EventDescription = formData.get("EventDescription") as string;
  const file = formData.get("DocumentPath") as File | null;
  const oldDoc = (formData.get("OldDocumentPath") as string) || "";

  let DocumentPath: string | null = oldDoc || null;

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads/event_docs");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, buffer);

    DocumentPath = `/uploads/event_docs/${file.name}`;
  }

  await prisma.events.update({
    where: { EventID },
    data: {
      EventDate,
      EventTypeID,
      EventDescription,
      DocumentPath,
    },
  });

  revalidatePath("/dashboard/admin/events");
  redirect("/dashboard/admin/events");
}


