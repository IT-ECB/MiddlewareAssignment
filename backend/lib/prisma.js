import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// Configure Prisma Client with connection options
const prismaOptions = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}

// For Railway/Production: Ensure SSL is used if DATABASE_URL doesn't include sslmode
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('sslmode')) {
  // Railway requires SSL, but we'll let the connection string handle it
  // The DATABASE_URL should include ?sslmode=require
  console.log('⚠️  Warning: DATABASE_URL should include ?sslmode=require for Railway')
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaOptions)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

