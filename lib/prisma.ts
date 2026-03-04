// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import { PrismaClient } from "@/app/generated/prisma/client";

// const adapter = new PrismaMariaDb({
//     host:"localhost",
//     port:3306,
//     user:"root",
//     password:"ShrutI@29",
//     database:"meeting_management",
//     connectionLimit:50
// })

// export const prisma = new PrismaClient({adapter});

import { PrismaClient } from "@/app/generated/prisma/client";


const globalForPrisma = global as unknown as { prisma: PrismaClient };


export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["query"],
    });


if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;