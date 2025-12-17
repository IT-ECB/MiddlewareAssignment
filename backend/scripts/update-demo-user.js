/**
 * Script to update/reset demo user password
 * Run with: node scripts/update-demo-user.js
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env') })

const prisma = new PrismaClient()

async function updateDemoUser() {
  const email = process.env.DEMO_EMAIL || 'demo@example.com'
  const password = process.env.DEMO_PASSWORD || 'demo123'

  try {
    // Find existing user
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (!existing) {
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Demo User',
        },
      })
      console.log(`Demo user ready: ${email} (${user.id})`)
      return
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    })

    console.log(`Demo user password updated: ${email}`)
  } catch (error) {
    console.error('Error updating demo user:', error?.message || error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

updateDemoUser()

