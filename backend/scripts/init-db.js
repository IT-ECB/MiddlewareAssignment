#!/usr/bin/env node

/**
 * Database Initialization Script
 * This script ensures the database schema is synced with Prisma schema
 * Run this after deploying to Railway or when tables are missing
 */

import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
const envPath = join(__dirname, '..', '.env')
dotenv.config({ path: envPath })

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set!')
  console.error('   Please set DATABASE_URL in your .env file or environment variables')
  process.exit(1)
}

try {
  // Step 1: Generate Prisma Client
  execSync('npm run db:generate', {
    cwd: join(__dirname, '..'),
    stdio: 'inherit'
  })

  // Step 2: Push schema to database
  execSync('npm run db:push', {
    cwd: join(__dirname, '..'),
    stdio: 'inherit'
  })

  // Step 3: Verify tables exist
  const { prisma } = await import('../lib/prisma.js')
  
  try {
    // Check if User table exists
    await prisma.user.count()
    await prisma.message.count()
    console.log('Database initialized.')
    
    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('Error verifying tables:', error?.message || error)
    await prisma.$disconnect()
    process.exit(1)
  }
} catch (error) {
  console.error('Database initialization failed:', error?.message || error)
  process.exit(1)
}

