import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateChatResponse(messages, personalityProfile) {
  const systemPrompt = personalityProfile
    ? `You are a helpful AI assistant. You have learned about the user through previous conversations. Here's what you know about them:

${personalityProfile}

Use this information to provide personalized responses. Be conversational and natural.`
    : `You are a helpful AI assistant. Be conversational and natural.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 500,
  })

  return response.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'
}

export async function generatePersonalityProfile(conversationHistory) {
  const conversationText = conversationHistory
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n\n')

  const prompt = `Based on the following conversation history, create a personality profile of the user. Focus on:
- Their interests and hobbies
- Their communication style
- Their preferences and values
- Their background or profession (if mentioned)
- Any notable personality traits

Conversation history:
${conversationText}

Generate a concise personality profile (2-3 paragraphs) that captures the essence of who this person is based on the conversation.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert at analyzing conversations and creating personality profiles.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 500,
  })

  return response.choices[0]?.message?.content || 'Unable to generate personality profile.'
}

