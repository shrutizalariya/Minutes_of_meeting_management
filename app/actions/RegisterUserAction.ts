// "use server";

// import { prisma } from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
// import bcrypt from "bcryptjs";

// export async function RegisterUserAction(formData: FormData) {
//   const name = formData.get("name") as string;
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;
//   const role = formData.get("role") as string || "user";

//   // Check if email already exists
//   const existingUser = await prisma.users.findUnique({ where: { Email: email } });
//   if (existingUser) {
//     throw new Error("Email already registered");
//   }

//   // Hash password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // Create user
//   await prisma.users.create({
//     data: {
//       Name: name,
//       Email : email,
//       Password: hashedPassword,
//       Role: role,
//     },
//   });

//   revalidatePath("/"); // optional: revalidate login page
//   redirect("/"); // redirect to login after registration
// }

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function RegisterUserAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string).toLowerCase(); // normalize
  const password = formData.get("password") as string;
  const role = ((formData.get("role") as string) || "user").toLowerCase();

  // Check if role is admin - Block registration
  if (role.toLowerCase() === "admin") {
    throw new Error("Admin registration is not allowed");
  }

  // Check if email already exists
  const existingUser = await prisma.users.findUnique({ where: { Email: email } });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await prisma.users.create({
    data: {
      Name: name,
      Email: email,
      Password: hashedPassword,
      Role: role,
    },
  });

  // If role is staff, also create staff record
  if (role.toLowerCase() === "staff") {
    await prisma.staff.create({
      data: {
        StaffName: name,
        EmailAddress: email,
        UserID: newUser.Id, // link to user
        MobileNo: "",       // optional, can fill later
        Remarks: "",        // optional
      },
    });
  }

  revalidatePath("/"); // optional
  redirect("/"); // redirect to login page
}
