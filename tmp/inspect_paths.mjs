import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const meetings = await prisma.meetings.findMany({
        take: 10,
        select: {
            MeetingID: true,
            DocumentPath: true
        }
    });
    console.log("Meetings Documents:");
    console.log(JSON.stringify(meetings, null, 2));

    const events = await prisma.events.findMany({
        take: 10,
        select: {
            EventID: true,
            DocumentPath: true
        }
    });
    console.log("\nEvents Documents:");
    console.log(JSON.stringify(events, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
