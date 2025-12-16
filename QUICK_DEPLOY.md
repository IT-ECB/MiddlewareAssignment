# Quick Deployment Checklist

## Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] OpenAI API key ready
- [ ] PostgreSQL database URL ready (or plan to create one)

## Railway Deployment (Recommended - Easiest)

### 1. Database Setup
- [ ] Create PostgreSQL database on Railway
- [ ] Copy `DATABASE_URL`

### 2. Backend Deployment
- [ ] Create new service from GitHub repo
- [ ] Set root directory to `backend`
- [ ] Set build command: `npm install && npm run db:generate`
- [ ] Set start command: `npm start`
- [ ] Add environment variables:
  - [ ] `DATABASE_URL`
  - [ ] `OPENAI_API_KEY`
  - [ ] `JWT_SECRET` (generate random string)
  - [ ] `PORT=5000`
  - [ ] `FRONTEND_URL` (update after frontend deploy)
- [ ] Copy backend URL

### 3. Frontend Deployment
- [ ] Create new service from same GitHub repo
- [ ] Set root directory to `/` (root)
- [ ] Set build command: `npm install && npm run build`
- [ ] Set start command: `npx vite preview --port $PORT --host`
- [ ] Add environment variable:
  - [ ] `VITE_API_URL` = backend URL
- [ ] Copy frontend URL

### 4. Final Steps
- [ ] Update `FRONTEND_URL` in backend environment variables
- [ ] Redeploy backend
- [ ] Run database migrations: `cd backend && npm run db:push`
- [ ] Test the application
- [ ] Create demo user (optional)

## Environment Variables Summary

### Backend
```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
JWT_SECRET=random-secret-key
PORT=5000
FRONTEND_URL=https://your-frontend.railway.app
```

### Frontend
```env
VITE_API_URL=https://your-backend.railway.app
```

## Common Issues

- **CORS errors**: Update `FRONTEND_URL` in backend
- **Database connection**: Verify `DATABASE_URL` format
- **Build fails**: Check Node.js version (needs 18+)
- **Frontend can't connect**: Verify `VITE_API_URL` is correct

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions and troubleshooting.

