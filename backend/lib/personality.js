import { prisma } from './prisma.js'
import { generatePersonalityProfile } from './openai.js'

const PERSONALITY_TRIGGERS = [
  'who am i',
  'tell me about myself',
  'what do you know about me',
  'describe me',
  'what am i like',
  'my personality',
]

export function isPersonalityQuery(message) {
  const normalized = message.toLowerCase().trim()
  return PERSONALITY_TRIGGERS.some((trigger) => normalized.includes(trigger))
}

export async function getOrGeneratePersonalityProfile(userId) {
  // Get all messages for the user
  const messages = await prisma.message.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    take: 50, // Limit to last 50 messages for context
  })

  if (messages.length < 3) {
    return "I haven't learned enough about you yet. Please chat with me a bit more so I can get to know you better!"
  }

  // Convert to format expected by OpenAI
  const conversationHistory = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }))

  // Generate personality profile
  const profile = await generatePersonalityProfile(conversationHistory)
  return profile
}

