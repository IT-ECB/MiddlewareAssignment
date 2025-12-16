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

console.log('🚀 Initializing database...\n')

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set!')
  console.error('   Please set DATABASE_URL in your .env file or environment variables')
  process.exit(1)
}

console.log('✅ DATABASE_URL is set')
console.log(`   Database: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`)

try {
  // Step 1: Generate Prisma Client
  console.log('📦 Step 1: Generating Prisma Client...')
  execSync('npm run db:generate', {
    cwd: join(__dirname, '..'),
    stdio: 'inherit'
  })
  console.log('✅ Prisma Client generated\n')

  // Step 2: Push schema to database
  console.log('📊 Step 2: Pushing schema to database...')
  execSync('npm run db:push', {
    cwd: join(__dirname, '..'),
    stdio: 'inherit'
  })
  console.log('✅ Schema pushed to database\n')

  // Step 3: Verify tables exist
  console.log('🔍 Step 3: Verifying tables...')
  const { prisma } = await import('../lib/prisma.js')
  
  try {
    // Check if User table exists
    const userCount = await prisma.user.count()
    console.log(`✅ User table exists (${userCount} users)`)
    
    // Check if Message table exists
    const messageCount = await prisma.message.count()
    console.log(`✅ Message table exists (${messageCount} messages)`)
    
    console.log('\n🎉 Database initialization completed successfully!')
    console.log('   All tables are created and ready to use.\n')
    
    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error verifying tables:')
    console.error(`   ${error.message}`)
    await prisma.$disconnect()
    process.exit(1)
  }
} catch (error) {
  console.error('\n❌ Database initialization failed:')
  console.error(`   ${error.message}`)
  process.exit(1)
}

