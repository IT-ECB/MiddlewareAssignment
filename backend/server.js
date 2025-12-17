import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { execSync } from 'child_process'
import { prisma } from './lib/prisma.js'
import { hashPassword, verifyPassword, generateToken, getUserFromToken } from './lib/auth.js'
import { generateChatResponse } from './lib/openai.js'
import { isPersonalityQuery, getOrGeneratePersonalityProfile } from './lib/personality.js'
import { z } from 'zod'

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env file in backend directory
dotenv.config({ path: join(__dirname, '.env') })

const app = express()
const PORT = process.env.PORT || 5000

// Middleware - CORS configuration
const baseAllowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  // Railway deployed backend origin (CORS matches origins, not URL paths like /api/health)
  'https://middlewareassignment-production.up.railway.app',
].filter(Boolean)

// Optional extra allowlist: comma-separated origins
// Example:
// ALLOWED_ORIGINS="https://a.up.railway.app,https://b.example.com"
const envAllowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const allowedOrigins = Array.from(new Set([...baseAllowedOrigins, ...envAllowedOrigins]))

function isAllowedRailwayOrigin(origin) {
  try {
    const { hostname } = new URL(origin)
    return hostname.endsWith('.up.railway.app') || hostname.endsWith('.railway.app')
  } catch {
    return false
  }
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    const isDev = process.env.NODE_ENV !== 'production'
    if (isDev) return callback(null, true)

    if (allowedOrigins.includes(origin)) return callback(null, true)

    // Railway often gives changing subdomains; allow Railway app domains by default.
    if (isAllowedRailwayOrigin(origin)) return callback(null, true)

    return callback(new Error(`CORS blocked for origin: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Log CORS configuration on startup
console.log('🌐 CORS configured for origins:', allowedOrigins)
app.use(express.json())

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const chatSchema = z.object({
  message: z.string().min(1),
})

// Auth middleware
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = await getUserFromToken(token)
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  req.user = user
  next()
}

// Routes

// Health check with database connection test
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    
    // Get database info
    const dbInfo = await prisma.$queryRaw`SELECT version(), current_database()`
    
    res.json({ 
      status: 'ok', 
      message: 'Backend API is running',
      database: {
        connected: true,
        url: process.env.DATABASE_URL ? 'Set' : 'Not set',
        version: dbInfo[0]?.version?.substring(0, 30) || 'Unknown',
        database: dbInfo[0]?.current_database || 'Unknown'
      }
    })
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      message: 'Backend API is running but database connection failed',
      database: {
        connected: false,
        error: error.message,
        url: process.env.DATABASE_URL ? 'Set' : 'Not set'
      }
    })
  }
})

// Register
app.post('/api/auth/register', async (req, res) => {
  console.log('📥 Register request received:', {
    email: req.body.email,
    timestamp: new Date().toISOString()
  })
  try {
    const { email, password, name } = registerSchema.parse(req.body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Create user
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    const token = generateToken(user.id)

    res.json({
      user,
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }

    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Login
app.post('/api/auth/login', async (req, res) => {
  console.log('📥 Login request received:', {
    email: req.body.email,
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    headers: req.headers
  })
  try {
    const { email, password } = loginSchema.parse(req.body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log('❌ User not found:', email)
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    console.log('🔐 Verifying password for:', email)
    console.log('🔐 Stored hash length:', user.password?.length || 0)
    console.log('🔐 Password provided length:', password?.length || 0)
    
    const isValid = await verifyPassword(password, user.password)
    console.log('🔐 Password verification result:', isValid ? '✅ MATCH' : '❌ NO MATCH')
    
    if (!isValid) {
      console.log('❌ Invalid password for:', email)
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = generateToken(user.id)
    console.log('✅ Login successful for:', email)

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('❌ Validation error:', error.errors)
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }

    console.error('❌ Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Chat
app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { message } = chatSchema.parse(req.body)

    // Check if this is a personality query
    let assistantResponse
    if (isPersonalityQuery(message)) {
      assistantResponse = await getOrGeneratePersonalityProfile(req.user.id)
    } else {
      // Get conversation history (before adding new message)
      const existingMessages = await prisma.message.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'asc' },
        take: 20, // Last 20 messages for context
      })

      const conversationHistory = [
        ...existingMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: 'user', content: message }, // Add current message
      ]

      // Generate response
      assistantResponse = await generateChatResponse(conversationHistory)
    }

    // Save user message
    await prisma.message.create({
      data: {
        userId: req.user.id,
        role: 'user',
        content: message,
      },
    })

    // Save assistant response
    await prisma.message.create({
      data: {
        userId: req.user.id,
        role: 'assistant',
        content: assistantResponse,
      },
    })

    res.json({
      message: assistantResponse,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }

    console.error('Chat error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get messages
app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    // Get all messages for the user
    const messages = await prisma.message.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    })

    res.json({ messages })
  } catch (error) {
    console.error('Get messages error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Check if tables exist in database
async function checkTablesExist() {
  try {
    // Try to query User table
    await prisma.user.findFirst()
    // Try to query Message table
    await prisma.message.findFirst()
    return true
  } catch (error) {
    // If tables don't exist, Prisma will throw an error
    if (error.message.includes('does not exist') || 
        error.message.includes('relation') ||
        error.message.includes('Unknown table')) {
      return false
    }
    // Other errors, re-throw
    throw error
  }
}

// Sync database schema (create tables if they don't exist)
async function syncDatabaseSchema() {
  try {
    console.log('\n📊 Syncing database schema...')
    
    // Generate Prisma Client
    console.log('   Generating Prisma Client...')
    execSync('npm run db:generate', {
      cwd: __dirname,
      stdio: 'pipe'
    })
    
    // Push schema to database
    console.log('   Pushing schema to database...')
    execSync('npm run db:push', {
      cwd: __dirname,
      stdio: 'pipe',
      env: { ...process.env }
    })
    
    console.log('✅ Database schema synced successfully')
    return true
  } catch (error) {
    console.error('❌ Failed to sync database schema:')
    console.error(`   ${error.message}`)
    return false
  }
}

// Database connection check function
async function checkDatabaseConnection() {
  try {
    console.log('\n🔍 Checking database connection...')
    console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'Set ✓' : 'NOT SET ✗'}`)
    
    if (!process.env.DATABASE_URL) {
      console.error('\n❌ DATABASE_URL environment variable is not set!')
      console.error('   Please create a .env file in the backend directory with:')
      console.error('   DATABASE_URL="postgresql://username@localhost:5432/chatbot?schema=public"')
      return false
    }

    // Test connection
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    
    // Check if tables exist
    const tablesExist = await checkTablesExist()
    if (!tablesExist) {
      console.log('⚠️  Database tables not found')
      
      // Auto-sync if enabled (default: true in production, false in development)
      const autoSync = process.env.AUTO_SYNC_DB !== 'false'
      if (autoSync || process.env.NODE_ENV === 'production') {
        console.log('   Attempting to create tables...')
        const synced = await syncDatabaseSchema()
        if (!synced) {
          console.error('\n   💡 Run manually: npm run db:push')
          console.error('   Or use: node scripts/init-db.js')
          return false
        }
        // Verify tables exist after sync
        const verified = await checkTablesExist()
        if (!verified) {
          console.error('   Tables still not found after sync')
          return false
        }
      } else {
        console.error('\n   💡 Tables need to be created. Run:')
        console.error('      npm run db:push')
        console.error('   Or: node scripts/init-db.js')
        return false
      }
    }
    
    // Try a simple query to verify
    const result = await prisma.$queryRaw`SELECT version()`
    console.log('✅ Database connected successfully')
    console.log(`   PostgreSQL version: ${result[0]?.version?.substring(0, 20) || 'Connected'}...`)
    return true
  } catch (error) {
    console.error('\n❌ Database connection failed:')
    console.error(`   Error: ${error.message}`)
    
    // Railway-specific error detection
    const isRailway = process.env.DATABASE_URL?.includes('railway') || 
                      error.message.includes('railway.internal') ||
                      error.message.includes('railway.app')
    
    if (isRailway) {
      console.error('\n   🚂 Railway Database Connection Issue:')
      console.error('   1. Check that PostgreSQL service is running in Railway')
      console.error('   2. Ensure DATABASE_URL includes ?sslmode=require')
      console.error('   3. Verify backend service is linked to PostgreSQL service')
      console.error('   4. Check Railway service logs for more details')
      console.error('   See RAILWAY_DB_FIX.md for detailed steps')
    } else if (error.message.includes('Environment variable not found')) {
      console.error('\n   💡 Solution: Make sure DATABASE_URL is set in backend/.env file')
    } else if (error.message.includes('P1001') || error.message.includes('ECONNREFUSED') || error.message.includes("Can't reach database server")) {
      console.error('\n   💡 Solution: Is PostgreSQL running?')
      if (!isRailway) {
      console.error('      Check: psql -l (should list databases)')
      console.error('      Start: brew services start postgresql@14 (macOS)')
      }
    } else if (error.message.includes('P1000') || error.message.includes('password')) {
      console.error('\n   💡 Solution: Check your database credentials in DATABASE_URL')
    } else if (error.message.includes('does not exist')) {
      console.error('\n   💡 Solution: Create the database: createdb chatbot')
    } else {
      console.error(`\n   💡 Full error: ${error.message}`)
    }
    return false
  }
}

// Start server
async function startServer() {
  // Check database connection before starting server
  const dbConnected = await checkDatabaseConnection()
  
  if (!dbConnected) {
    console.error('\n⚠️  Server will start but database operations will fail!')
    console.error('   Fix the database connection and restart the server.\n')
  }

  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`)
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`)
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`)
  })
}

startServer().catch(console.error)

