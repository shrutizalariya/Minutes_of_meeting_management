// "use server";

// import { prisma } from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
// import bcrypt from "bcryptjs";

// export async function AddStaffAction(formData: FormData) {
//   const StaffName = formData.get("StaffName") as string;
//   const CountryCode = formData.get("CountryCode") as string;
//   const MobileNo = formData.get("MobileNo") as string;
//   const EmailAddress = formData.get("EmailAddress") as string;
//   const Remarks = formData.get("Remarks") as string;
//   const UserID = Number(formData.get("UserID"));

//     // find existing user
//   const existingUser = await prisma.users.findUnique({
//     where: { Email: EmailAddress },
//   });

//   if (!existingUser) {
//     throw new Error("User not found. Create user first.");
//   }

//   // create staff linked to that user
//   await prisma.staff.create({
//     data: {
//       StaffName,
//       MobileNo: `${CountryCode}${MobileNo}`,
//       EmailAddress,
//       Remarks,
//       UserID: existingUser.Id,
//     },
//   });

//   revalidatePath("/staff");
//   redirect("/staff"); // redirect to staff list after adding
// }

// "use server";

// import { prisma } from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

// export async function AddStaffAction(formData: FormData) {
//   const StaffName = formData.get("StaffName") as string;
//   const CountryCode = formData.get("CountryCode") as string;
//   const MobileNo = formData.get("MobileNo") as string;
//   const EmailAddress = formData.get("EmailAddress") as string;
//   const Remarks = formData.get("Remarks") as string;
//   const UserID = Number(formData.get("UserID"));

//   await prisma.staff.create({
//     data: {
//       StaffName,
//       MobileNo: `${CountryCode}${MobileNo}`,
//       EmailAddress,
//       Remarks,
//       UserID,
//     },
//   });

//   revalidatePath("/staff");
//   redirect("/staff");
// }

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function AddStaffAction(formData: FormData) {
  const StaffName = formData.get("StaffName") as string;
  const CountryCode = formData.get("CountryCode") as string;
  const MobileNo = formData.get("MobileNo") as string;
  const EmailAddress = formData.get("EmailAddress") as string;
  const Remarks = formData.get("Remarks") as string;
  const UserID = Number(formData.get("UserID"));

  // ✅ Step 1: Validate fields
  if (!StaffName || !EmailAddress || !MobileNo || !UserID) {
    throw new Error("All required fields must be filled");
  }

  // ✅ Step 2: Check if staff already exists for this user
  const existingStaff = await prisma.staff.findUnique({
    where: { UserID },
  });

  if (existingStaff) {
    throw new Error("This user already has a staff record.");
  }

  // ✅ Step 3: Create staff
  await prisma.staff.create({
    data: {
      StaffName,
      MobileNo: `${CountryCode}${MobileNo}`,
      EmailAddress,
      Remarks,
      UserID,
    },
  });

  // ✅ Step 4: Refresh and redirect
  revalidatePath("/dashboard/admin/staff");
  redirect("/dashboard/admin/staff");
}