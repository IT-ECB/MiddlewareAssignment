# AI Chatbot (Middleware Assignment)

This is a full-stack AI chatbot application with authentication, chat history, and personality profiling based on your conversations.

## Features

- **Auth**: Register/login with JWT
- **Chat**: Context-aware chat powered by OpenAI
- **Memory**: Stores messages in PostgreSQL using Prisma
- **Personality profiling**: Ask prompts like “Who am I?” after a few messages
- **Modern UI**: React + Vite + Tailwind UI

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL + Prisma
- **Auth**: JWT + bcrypt
- **AI**: OpenAI

## Repository Layout

```
MiddlewareAssignment/
├── src/                   # React frontend
├── backend/               # Express + Prisma backend
│   ├── prisma/schema.prisma
│   ├── server.js
│   └── scripts/
└── vite.config.js
```

## Prerequisites (Local)

- Node.js **18+**
- PostgreSQL **14+**
- An OpenAI API key

## Local Setup (Step-by-step)

### 1) Clone and install dependencies

Frontend (root):

```bash
cd MiddlewareAssignment
npm install
```

Backend:

```bash
cd backend
npm install
```

### 2) Create the database (PostgreSQL)

Create a local database (example name: `chatbot`):

```bash
createdb chatbot
```

If you don’t have `createdb`, open `psql` and create it from there.

### 3) Configure environment variables

#### Backend: `backend/.env`

Create `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/chatbot?schema=public"
OPENAI_API_KEY="sk-..."
JWT_SECRET="replace-with-a-long-random-secret"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

Notes:
- Replace `USER:PASSWORD` with your local Postgres credentials.
- `FRONTEND_URL` is used for CORS.

#### Frontend: `.env` (root)

Create `.env` in the project root:

```env
VITE_API_URL="http://localhost:5000"
```

### 4) Create tables with Prisma

From `backend/`:

```bash
npm run db:generate
npm run db:push
```

This will generate the Prisma client and create the tables (`User`, `Message`) in your Postgres database.

### 5) Start the app (two terminals)

Terminal A (backend):

```bash
cd backend
npm run dev
```

Backend runs on:
- `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

Terminal B (frontend):

```bash
cd MiddlewareAssignment
npm run dev
```

Frontend runs on:
- `http://localhost:3000`

## Demo user (optional)

From `backend/`:

```bash
npm run create-demo-user
```

Defaults:
- Email: `demo@example.com`
- Password: `demo123`

You can also set:
- `DEMO_EMAIL`
- `DEMO_PASSWORD`

## Common Problems (Local)

### CORS error in browser

- Ensure backend `.env` has:
  - `FRONTEND_URL="http://localhost:3000"`
- Restart the backend after changing env vars.

### Prisma errors / tables not created

From `backend/`:

```bash
npm run db:generate
npm run db:push
```

If needed:

```bash
npm run db:init
```

### Frontend can’t connect to backend

- Ensure root `.env` has:
  - `VITE_API_URL="http://localhost:5000"`
- Check backend is running: `http://localhost:5000/api/health`

## Production Notes (Railway)

- Frontend uses `vite preview` and must bind to Railway’s `$PORT`. This repo’s `npm start` is already set up for that.
- Backend CORS uses `FRONTEND_URL` and also supports `ALLOWED_ORIGINS` (comma-separated) if you want extra origins.


