import { PrismaClient } from '../app/generated/prisma';
const prisma = new PrismaClient();

async function checkUsers() {
    const users = await prisma.users.findMany({ take: 5 });
    console.log('Users found:', users);
    await prisma.$disconnect();
}

checkUsers().catch(console.error);
