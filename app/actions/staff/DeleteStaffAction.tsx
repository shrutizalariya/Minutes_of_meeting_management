"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function DeleteStaffAction(id:number){
    await prisma.staff.delete({where:{StaffID:id}});
    revalidatePath("/dashboard/admin/staff");
    redirect("/dashboard/admin/staff?success=Staff+Member+Deleted+Successfully");
}

export {DeleteStaffAction};