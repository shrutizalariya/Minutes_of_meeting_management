"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function EditStaffAction(formData: FormData) {
  const idValue = formData.get("StaffID");

  if (!idValue) {
    throw new Error("Staff ID is missing");
  }

  const id = Number(idValue);

  if (isNaN(id)) {
    throw new Error("Invalid Staff ID");
  }

  const staffname = formData.get("StaffName") as string;
  const mobileno = formData.get("MobileNo") as string;
  const emailaddress = formData.get("EmailAddress") as string;
  const remarks = formData.get("Remarks") as string;

  await prisma.staff.update({
    where: {
      StaffID: id,
    },
    data: {
      StaffName: staffname,
      MobileNo: mobileno,
      EmailAddress: emailaddress,
      Remarks: remarks,
    },
  });

  revalidatePath("/staff");
  redirect("/staff");
}

export { EditStaffAction };
