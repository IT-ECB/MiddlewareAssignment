# Quick Start Guide

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed and running locally
- [ ] OpenAI API key

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/chatbot?schema=public"
OPENAI_API_KEY="sk-your-key-here"
JWT_SECRET="any-random-string-for-development"
```

**Note**: Replace `your_password` with your PostgreSQL password. If you haven't set up PostgreSQL yet, see [DATABASE_SETUP.md](./DATABASE_SETUP.md)

### 3. Set Up Database
```bash
npm run db:generate
npm run db:push
```

### 4. (Optional) Create Demo User
```bash
export DEMO_EMAIL="demo@example.com"
export DEMO_PASSWORD="demo123"
npx tsx scripts/create-demo-user.ts
```

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Testing the Personality Feature

1. **Sign up/Login** to the application
2. **Chat with the AI** - have at least 3-4 exchanges:
   - "Hi, I'm a software engineer"
   - "I love hiking and reading"
   - "I'm interested in AI and machine learning"
3. **Ask about yourself**:
   - "Who am I?"
   - "Tell me about myself"
   - "What do you know about me?"

The AI should respond with a personality profile based on your conversation!

## Common Issues

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database credentials

### OpenAI API Error
- Verify `OPENAI_API_KEY` is set correctly
- Check API key has sufficient credits
- Ensure API key is valid

### Build Errors
- Run `npm run db:generate` before building
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Next Steps

- Read [README.md](./README.md) for detailed documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- Review [SUBMISSION.md](./SUBMISSION.md) for submission details

