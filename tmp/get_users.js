const { PrismaClient } = require("./app/generated/prisma");
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.users.findMany();
    console.log(JSON.stringify(users, null, 2));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
