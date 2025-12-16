# Submission Summary - Middleware Assignment

## Project Overview

This is a full-stack AI chatbot application built with React + Vite (frontend) and Express.js (backend) that allows users to chat freely, stores conversation history, and generates personality profiles based on chat interactions.

## Key Features Implemented

✅ **Free-form Chatting**: Users can chat naturally with an AI assistant  
✅ **Conversation Storage**: All messages are persisted in PostgreSQL database  
✅ **Personality Profiling**: After a few messages, users can ask "Who am I?" to get a personalized profile  
✅ **Authentication**: Secure JWT-based authentication system  
✅ **Clean UI**: Modern, responsive interface using Tailwind CSS and shadcn/ui  
✅ **Tests**: Unit tests for core functionality (personality detection, authentication)  
✅ **Hosted Version**: Ready for deployment to Vercel, Railway, or similar platforms  

## Tech Stack

- **Frontend**: React + Vite, JavaScript, Tailwind CSS
- **Backend**: Express.js REST API
- **Database**: PostgreSQL with Prisma ORM (local server)
- **AI**: OpenAI GPT-4o-mini
- **Authentication**: JWT with bcrypt
- **Testing**: Vitest
- **UI Components**: shadcn/ui

## Repository Structure

```
├── app/
│   ├── api/              # API routes (auth, chat, messages)
│   ├── chat/             # Chat interface page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Login/signup page
├── components/ui/        # Reusable UI components
├── lib/                  # Core utilities
│   ├── auth.ts          # Authentication helpers
│   ├── openai.ts        # OpenAI integration
│   ├── personality.ts   # Personality profiling logic
│   └── prisma.ts        # Database client
├── prisma/
│   └── schema.prisma    # Database schema
├── test/                # Test files
├── scripts/             # Utility scripts
└── README.md            # Setup instructions
```

## How It Works

### Conversation Flow
1. User registers/logs in
2. User sends messages through the chat interface
3. Messages are stored in the database
4. AI generates responses using conversation context (last 20 messages)
5. Responses are also stored for future context

### Personality Profiling
1. User asks questions like "Who am I?" or "Tell me about myself"
2. System detects personality query triggers
3. Retrieves last 50 messages from conversation history
4. Sends to OpenAI with specialized prompt to generate personality profile
5. Returns personalized profile based on interests, communication style, preferences, etc.

## Setup & Running Locally

See [README.md](./README.md) for detailed instructions.

Quick start:
```bash
npm install
# Set up .env with DATABASE_URL, OPENAI_API_KEY, JWT_SECRET
npm run db:generate
npm run db:push
npm run dev
```

## Testing

Run tests with:
```bash
npm test
```

Tests cover:
- Personality query detection
- Password hashing and verification
- JWT token generation and verification

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Recommended platforms:
- **Vercel** (supports Vite/React)
- **Netlify** (great for Vite)
- **Railway** (includes database)
- **Render** (good alternative)

## Demo Credentials

See [DEMO_CREDENTIALS.md](./DEMO_CREDENTIALS.md) for demo user credentials.

**Note**: Credentials are NOT hardcoded. They should be created in the production database.

## Video Demo

[Link to 30-60 second video demo showing the project in action]

The video demonstrates:
1. User registration/login
2. Starting a conversation
3. Having multiple exchanges
4. Asking "Who am I?" to see the personality profile
5. The AI responding with a personalized profile based on the conversation

## Implementation Highlights

### Security
- Passwords are hashed using bcrypt
- JWT tokens for authentication
- No hardcoded credentials
- Environment variables for sensitive data

### Code Quality
- TypeScript for type safety
- Zod for input validation
- Clean separation of concerns
- Reusable components
- Error handling throughout

### User Experience
- Responsive design
- Loading states
- Error messages
- Smooth scrolling in chat
- Optimistic UI updates

## Future Enhancements (Not Implemented)

- Real-time updates with WebSockets
- Message search functionality
- Export conversation history
- Multiple personality profile formats
- Conversation analytics
- Dark mode toggle

## Contact

For questions about this implementation, please reach out through the submission channel.

---

**Submission Date**: [Date]  
**Developer**: [Your Name]  
**Assignment**: Middleware Senior Full Stack Engineer Take-Home

