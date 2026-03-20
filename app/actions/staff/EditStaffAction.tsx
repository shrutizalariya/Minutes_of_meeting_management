"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function EditStaffAction(formData: FormData) {
  const StaffID = Number(formData.get("StaffID"));
  const StaffName = formData.get("StaffName") as string;
  const CountryCode = formData.get("CountryCode") as string;
  const MobileNo = formData.get("MobileNo") as string;
  const EmailAddress = formData.get("EmailAddress") as string;
  const Remarks = formData.get("Remarks") as string;
  const UserID = Number(formData.get("UserID"));

  if (!StaffID || !StaffName || !MobileNo || !EmailAddress || !UserID) {
    throw new Error("All required fields must be filled");
  }

  const existingStaffForUser = await prisma.staff.findUnique({
    where: { UserID },
  });

  if (existingStaffForUser && existingStaffForUser.StaffID !== StaffID) {
    throw new Error("This user is already linked to another staff.");
  }
  
  await prisma.staff.update({
    where: { StaffID },
    data: {
      StaffName,
      MobileNo: `${CountryCode}${MobileNo}`,
      EmailAddress,
      Remarks,
      UserID,
      Modified: new Date(),
    },
  });

  revalidatePath("/dashboard/admin/staff");
  redirect("/dashboard/admin/staff?success=Staff+Member+Updated+Successfully");
}