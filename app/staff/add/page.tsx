import { prisma } from "@/lib/prisma";
import AddStaff from "@/app/staff/add/AddStaff";

export default async function Page() {
  const users = await prisma.users.findMany({
     where: {
    staff: null, // only users without staff
  },
  });

  return <AddStaff users={users} />;
}