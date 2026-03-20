import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  try {
    const count = await prisma.users.count()
    console.log('User count:', count)
  } catch (e) {
    console.error('Prisma connection failed:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}
main()
