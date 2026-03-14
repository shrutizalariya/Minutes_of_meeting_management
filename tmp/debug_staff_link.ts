
import { PrismaClient } from '../app/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.users.findMany();
  const staff = await prisma.staff.findMany();

  console.log('--- POTENTIAL LINKS TO FIX ---');
  staff.forEach(s => {
    if (!s.UserID && s.EmailAddress) {
      const match = users.find(u => u.Email?.toLowerCase() === s.EmailAddress?.toLowerCase());
      if (match) {
        console.log(`FIXABLE: Staff ${s.StaffName} (${s.EmailAddress}) -> User ID ${match.Id}`);
      }
    }
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
