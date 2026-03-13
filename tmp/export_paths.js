const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function main() {
    const meetings = await prisma.meetings.findMany({
        take: 20,
        select: {
            MeetingID: true,
            DocumentPath: true
        }
    });

    const events = await prisma.events.findMany({
        take: 20,
        select: {
            EventID: true,
            DocumentPath: true
        }
    });

    const data = { meetings, events };
    fs.writeFileSync("tmp/db_paths.json", JSON.stringify(data, null, 2));
}

main()
    .catch((e) => {
        fs.writeFileSync("tmp/db_paths_error.txt", e.stack);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
