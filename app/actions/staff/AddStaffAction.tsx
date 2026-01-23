"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function AddStaffAction(formData: FormData){
// console.log(formData)
    const StaffName = formData.get("StaffName") as string;
    const MobileNo = formData.get("MobileNo") as string;
    const EmailAddress = formData.get("EmailAddress") as string;
    const Remarks = formData.get("Remarks") as string;
    const data = {StaffName, MobileNo, EmailAddress , Remarks};
   try {
  await prisma.staff.create({ data });
} catch (error) {
  console.error("Staff create error:", error);
  throw new Error("Database error");
}
    revalidatePath("/staff");
    redirect("/staff")
}

export {AddStaffAction};