import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// Configure Prisma Client with connection options
const prismaOptions = {
  log: ['error'],
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaOptions)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

