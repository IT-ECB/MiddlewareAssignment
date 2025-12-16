# Setup Guide - Frontend & Backend Separation

This project is now split into separate frontend and backend applications.

## Project Structure

```
MiddlewareAssignment/
├── backend/          # Express.js API server
│   ├── lib/          # Backend utilities
│   ├── prisma/       # Database schema
│   ├── scripts/      # Utility scripts
│   └── server.js     # Express server
├── src/              # React + Vite frontend
│   ├── pages/        # Page components
│   ├── components/   # UI components
│   └── config/       # Configuration
├── components/       # React components
└── package.json      # Frontend dependencies
```

## Quick Start

### 1. Backend Setup

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
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# From project root
npm install
```

Create `.env`:
```env
VITE_API_URL="http://localhost:5000"
```

```bash
# Start frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

## Running Both Servers

### Option 1: Separate Terminals

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### Option 2: Using npm-run-all (Optional)

Add to root `package.json`:
```json
{
  "scripts": {
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "vite",
    "dev": "npm-run-all --parallel dev:backend dev:frontend"
  },
  "devDependencies": {
    "npm-run-all": "^4.1.5"
  }
}
```

Then run: `npm run dev`

## API Endpoints

All backend endpoints are prefixed with `/api`:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/chat` - Send chat message
- `GET /api/messages` - Get user messages
- `GET /api/health` - Health check

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `JWT_SECRET` - Secret for JWT tokens
- `PORT` - Backend server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

## Development

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- Frontend calls backend API automatically

## Production Deployment

### Backend
- Deploy to Railway, Render, or similar
- Set environment variables
- Database should be accessible

### Frontend
- Deploy to Vercel, Netlify, or similar
- Set `VITE_API_URL` to your backend URL
- Build: `npm run build`

