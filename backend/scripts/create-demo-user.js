/**
 * Script to create a demo user for testing
 * Run with: node scripts/create-demo-user.js
 * 
 * Note: This is for local development only.
 * Demo credentials should be provided separately for production.
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

async function createDemoUser() {
  const email = process.env.DEMO_EMAIL || 'demo@example.com'
  const password = process.env.DEMO_PASSWORD || 'demo123'
  const name = 'Demo User'

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      console.log(`User with email ${email} already exists.`)
      console.log('Demo credentials:')
      console.log(`  Email: ${email}`)
      console.log(`  Password: ${password}`)
      return
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    console.log('Demo user created successfully!')
    console.log('Demo credentials:')
    console.log(`  Email: ${email}`)
    console.log(`  Password: ${password}`)
    console.log(`  User ID: ${user.id}`)
  } catch (error) {
    console.error('Error creating demo user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createDemoUser()

