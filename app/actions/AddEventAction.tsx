"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export async function AddEventAction(formData: FormData) {
  const EventDate = formData.get("EventDate") as string;
  const EventTypeID = Number(formData.get("EventTypeID"));
  const EventDescription = formData.get("EventDescription") as string | null;
  const file = formData.get("DocumentPath") as File | null;

  let DocumentPath: string | null = null;

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

  await prisma.events.create({
    data: {
      EventDate: new Date(EventDate),
      EventTypeID,
      EventDescription,
      DocumentPath,
      IsCancelled: false,
    },
  });

  revalidatePath("/dashboard/admin/events");
  redirect("/dashboard/admin/events?success=Event+Added+Successfully");
}


