# AI Chatbot - Middleware Assignment

An intelligent AI chatbot application that learns from conversations and can generate personality profiles based on chat history.

## Features

- 💬 **Free-form Chatting**: Chat naturally with an AI assistant powered by OpenAI
- 🧠 **Conversation Memory**: All conversations are stored and used as context for future interactions
- 👤 **Personality Profiling**: After a few messages, ask "Who am I?" or "Tell me about myself" to get a personalized personality profile derived from your chat history
- 🔐 **Authentication**: Secure user authentication with JWT tokens
- 🎨 **Modern UI**: Clean, responsive interface built with React + Vite, Tailwind CSS, and shadcn/ui components

## Tech Stack

- **Frontend**: React + Vite, JavaScript, Tailwind CSS
- **Backend**: Express.js REST API (separate server)
- **Database**: PostgreSQL with Prisma ORM (local server)
- **AI**: OpenAI GPT-4o-mini
- **Authentication**: JWT with bcrypt
- **Testing**: Vitest

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database server (local installation)
- OpenAI API key

## Project Structure

This project is split into **Frontend** and **Backend**:

- **Frontend**: React + Vite application in the root directory
- **Backend**: Express.js API server in `/backend` directory

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## Quick Setup

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
DATABASE_URL="postgresql://roopansh@localhost:5432/chatbot?schema=public"
OPENAI_API_KEY="your-openai-api-key"
JWT_SECRET="your-secret-key"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

```bash
npm run db:generate
npm run db:push
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
# From project root
npm install
```

Create `.env`:
```env
VITE_API_URL="http://localhost:5000"
```

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

**See [SETUP.md](./SETUP.md) for detailed instructions.**

## Demo Credentials

For testing purposes, you can:

1. **Create an account** through the sign-up page on the app
2. **Use the demo user script** (for local development):
   ```bash
   npm run create-demo-user
   ```
   Or:
   ```bash
   node scripts/create-demo-user.js
   ```
   This will create a demo user with:
   - **Email**: `demo@example.com`
   - **Password**: `demo123`

**Note**: Demo credentials are not hardcoded in the codebase. For production, demo credentials should be provided separately in the submission documentation.

## Usage

1. **Sign Up/Login**: Create an account or log in with existing credentials
2. **Start Chatting**: Begin a conversation with the AI assistant
3. **Build Context**: Have a few conversations to build up context
4. **Ask About Yourself**: Try asking:
   - "Who am I?"
   - "Tell me about myself"
   - "What do you know about me?"
   - "Describe me"
   - "What am I like?"

The AI will analyze your conversation history and generate a personality profile!

## Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Option 2: Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add PostgreSQL service
4. Add environment variables
5. Deploy!

### Environment Variables for Production

Make sure to set these in your hosting platform:

- `DATABASE_URL`: Your PostgreSQL connection string
- `OPENAI_API_KEY`: Your OpenAI API key
- `JWT_SECRET`: A strong, random secret key

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── chat/         # Chat endpoint
│   │   └── messages/     # Messages retrieval
│   ├── chat/             # Chat page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Login/signup page
├── components/
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions
│   ├── auth.ts          # Authentication helpers
│   ├── openai.ts        # OpenAI integration
│   ├── personality.ts   # Personality profiling
│   └── prisma.ts        # Prisma client
├── prisma/
│   └── schema.prisma    # Database schema
└── test/                # Test files
```

## Core Features Implementation

### Conversation Storage
All messages are stored in the database with user association, allowing the AI to maintain context across sessions.

### Personality Profiling
When a user asks about themselves, the system:
1. Retrieves the last 50 messages from the conversation history
2. Sends them to OpenAI with a specialized prompt
3. Generates a personality profile based on interests, communication style, preferences, and traits

### Context-Aware Responses
The AI uses the last 20 messages as context for generating responses, ensuring continuity in conversations.

## License

This project is created for the Middleware assignment.

## Contact

For questions or issues, please contact the development team.

