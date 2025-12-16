# Deployment Guide

This guide provides instructions for deploying the AI Chatbot application (React + Vite frontend + Express backend) to various hosting platforms.

## Architecture Overview

This application consists of:
- **Frontend**: React + Vite application (runs on port 3000 in dev)
- **Backend**: Express.js API server (runs on port 5000)
- **Database**: PostgreSQL (required)

Both frontend and backend need to be deployed. You can:
1. Deploy both on the same platform (Railway, Render)
2. Deploy frontend and backend separately (e.g., Vercel for frontend, Railway for backend)

## Prerequisites

- OpenAI API key
- Git repository (GitHub recommended)
- PostgreSQL database (hosted or local)

## Environment Variables

### Backend Environment Variables

Create `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
OPENAI_API_KEY="sk-..."
JWT_SECRET="your-strong-random-secret-key"
PORT=5000
FRONTEND_URL="https://your-frontend-url.vercel.app"
```

### Frontend Environment Variables

Create `.env` in the root directory:

```env
VITE_API_URL="https://your-backend-url.railway.app"
```

## Free Hosting Options

### Can I Host Everything on GitHub for Free?

**Short Answer: No, but you can host the frontend on GitHub Pages (free).**

**What GitHub Offers:**
- ✅ **GitHub Pages** - Free static site hosting (can host your React frontend after building)
- ❌ **No Backend Hosting** - GitHub cannot run Node.js/Express servers
- ❌ **No Database Hosting** - GitHub doesn't provide databases

**What You Need:**
- **Frontend**: GitHub Pages (free) OR Vercel/Netlify (free)
- **Backend**: Railway/Render (free tiers available)
- **Database**: Railway/Render/Supabase (free tiers available)

### Recommended Free Hosting Stack

**Option A: Fully Free (Best for Students/Projects)**
- **Frontend**: GitHub Pages or Vercel (free)
- **Backend**: Render (free tier) or Railway ($5 credit/month)
- **Database**: Render PostgreSQL (free tier) or Supabase (free tier)

**Option B: All-in-One Free**
- **Everything on Render**: Frontend + Backend + Database (all free tier)
- **Everything on Railway**: Frontend + Backend + Database ($5 credit/month, then pay-as-you-go)

**Note**: Free tiers usually have limitations (sleep after inactivity, limited resources, etc.)

## Deployment Options

### Option 1: Railway (Recommended - Easiest)

Railway can host both your frontend and backend, plus provides PostgreSQL.

#### Step 1: Set Up PostgreSQL Database

1. Go to [railway.app](https://railway.app) and sign up
2. Create a new project
3. Click "New" → "Database" → "Add PostgreSQL"
4. Copy the `DATABASE_URL` from the database service
postgresql://postgres:IRZQiXchFSuukIdBnujdreEjxEnZyTme@postgres.railway.internal:5432/railway

#### Step 2: Deploy Backend

1. In the same Railway project, click "New" → "GitHub Repo"
2. Select your repository
3. Railway will auto-detect it's a Node.js app
4. **Configure the service:**
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run db:generate && npm run db:push`
   - **Start Command**: `npm start`
5. **Add Environment Variables:**
   - `DATABASE_URL` (from PostgreSQL service)
   - `OPENAI_API_KEY`
   - `JWT_SECRET` (generate a strong random string)
   - `PORT=5000`
   - `FRONTEND_URL` (you'll update this after deploying frontend)
6. Railway will generate a URL like `https://your-backend.railway.app`

#### Step 3: Deploy Frontend

1. In the same Railway project, click "New" → "GitHub Repo" again
2. Select the same repository
3. **Configure the service:**
   - **Root Directory**: `/` (root)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx vite preview --port $PORT --host`
4. **Add Environment Variables:**
   - `VITE_API_URL` = your backend URL (from Step 2)
5. Railway will generate a URL for your frontend

#### Step 4: Update CORS

1. Go back to your backend service settings
2. Update `FRONTEND_URL` to your frontend URL
3. Redeploy the backend

#### Step 5: Database Tables (Auto-Created!)

**Good News**: Tables are now **automatically created** when the server starts!

The server will:
1. Check if tables exist
2. If not, automatically run `db:push` to create them
3. Continue startup

**Manual Option** (if auto-sync fails):
1. In Railway, go to your backend service
2. Click on the service → "Deployments" → "View Logs" → "Shell"
3. Run:
   ```bash
   cd backend
   npm run db:push
   ```
   Or use the init script:
   ```bash
   npm run db:init
   ```

### Option 2: Render

Render can also host both frontend and backend.

#### Step 1: Set Up PostgreSQL Database

1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "PostgreSQL"
3. Create a database and copy the `Internal Database URL`

#### Step 2: Deploy Backend

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. **Configure:**
   - **Name**: `chatbot-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run db:generate`
   - **Start Command**: `npm start`
4. **Add Environment Variables:**
   - `DATABASE_URL` (use the Internal Database URL)
   - `OPENAI_API_KEY`
   - `JWT_SECRET`
   - `PORT=5000`
   - `FRONTEND_URL` (update after frontend deployment)
5. Click "Create Web Service"
6. Copy the service URL (e.g., `https://chatbot-backend.onrender.com`)

#### Step 3: Deploy Frontend

1. Click "New" → "Static Site"
2. Connect your GitHub repository
3. **Configure:**
   - **Name**: `chatbot-frontend`
   - **Root Directory**: `/` (root)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Add Environment Variables:**
   - `VITE_API_URL` = your backend URL
5. Click "Create Static Site"
6. Copy the frontend URL

#### Step 4: Update CORS and Run Migrations

1. Update `FRONTEND_URL` in backend environment variables
2. Redeploy backend
3. To run migrations, use Render's shell or add a one-time script

### Option 3: GitHub Pages (Frontend) + Render/Railway (Backend)

This option uses GitHub Pages for the frontend (completely free) and Render/Railway for the backend.

#### Deploy Frontend on GitHub Pages

1. **Configure Base Path (if needed):**
   If your repository name is NOT `yourusername.github.io`, you need to set a base path.
   Update `vite.config.js`:
   ```js
   export default defineConfig({
     base: '/repository-name/', // Replace with your actual repo name
     // ... rest of config
   })
   ```
   **Note**: If your repo is named `yourusername.github.io`, skip this step.

2. **Set Repository Secret:**
   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Add secret: `VITE_API_URL` = your backend URL

3. **Enable GitHub Pages:**
   - Go to your GitHub repository → Settings → Pages
   - Under "Source", select "GitHub Actions"
   - Save

4. **GitHub Actions Workflow (Already Created):**
   The workflow file `.github/workflows/deploy-pages.yml` is already set up!
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

5. **Set Environment Variable:**
   - In GitHub repo: Settings → Secrets and variables → Actions
   - Add `VITE_API_URL` as a repository secret
   - Update the workflow to use it:
     ```yaml
     - run: npm run build
       env:
         VITE_API_URL: ${{ secrets.VITE_API_URL }}
     ```

6. **Your site will be at:** `https://yourusername.github.io/repository-name`

#### Deploy Backend (Render or Railway)

Follow **Option 1** or **Option 2** steps for backend deployment.

#### Update CORS

Update `FRONTEND_URL` in your backend environment variables to your GitHub Pages URL.

### Option 4: Vercel (Frontend) + Railway/Render (Backend)

This option uses Vercel for the frontend (great for React apps, free tier) and Railway/Render for the backend.

#### Deploy Backend (Railway or Render)

Follow **Option 1** or **Option 2** steps for backend deployment.

#### Deploy Frontend on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. **Configure:**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Add Environment Variables:**
   - `VITE_API_URL` = your backend URL
7. Click "Deploy"
8. Vercel will give you a URL like `https://your-app.vercel.app`

#### Update Backend CORS

Update `FRONTEND_URL` in your backend environment variables to your Vercel URL.

### Option 4: DigitalOcean App Platform

1. Go to [DigitalOcean](https://www.digitalocean.com)
2. Create a new App
3. Connect your GitHub repository
4. Add a PostgreSQL database component
5. Add two components:
   - **Backend**: Node.js service in `backend/` directory
   - **Frontend**: Static site built from root directory
6. Configure environment variables for each component

## Post-Deployment Steps

### 1. Run Database Migrations

After deploying the backend, you need to run Prisma migrations:

**Option A: Using Railway/Render Console**
```bash
cd backend
npm run db:push
```

**Option B: Add to Build Script**
You can modify the build command to include migrations:
```bash
npm install && npm run db:generate && npm run db:push
```

**Option C: One-time Migration Script**
Create a script that runs migrations on first deploy.

### 2. Create Demo User (Optional)

If you want to provide demo credentials:

**Using Railway/Render Console:**
```bash
cd backend
node scripts/create-demo-user.js
```

Or create the user manually through the app's registration page.

### 3. Verify Deployment

1. Visit your deployed frontend URL
2. Create an account or use demo credentials
3. Test the chat functionality
4. Test personality profiling after a few messages

## Database Setup

### Using Hosted PostgreSQL

Recommended services:
- **Railway PostgreSQL** (easiest if using Railway)
- **Render PostgreSQL** (if using Render)
- **Supabase** (free tier available)
- **Neon** (serverless PostgreSQL)
- **ElephantSQL** (free tier available)

### Database Connection String Format

```
postgresql://username:password@host:5432/database?schema=public
```

### Running Migrations

After setting up your database:

```bash
cd backend
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
```

## Important Configuration Notes

### CORS Configuration

The backend needs to allow requests from your frontend URL. Make sure:
1. `FRONTEND_URL` environment variable is set correctly in backend
2. The backend's CORS middleware includes your frontend URL

### Environment Variables

- **Never commit `.env` files** to Git
- Use your hosting platform's environment variable settings
- Different values for development vs production

### Build Commands

**Backend:**
- Build: `npm install && npm run db:generate`
- Start: `npm start`

**Frontend:**
- Build: `npm install && npm run build`
- Start (preview): `npx vite preview --port $PORT --host`

## Troubleshooting

### Backend Not Starting

- Check that all environment variables are set
- Verify `DATABASE_URL` is correct and accessible
- Check logs in your hosting platform's dashboard
- Ensure `PORT` is set (or defaults to 5000)

### Frontend Can't Connect to Backend

- Verify `VITE_API_URL` is set correctly in frontend
- Check backend CORS configuration includes frontend URL
- Ensure backend is running and accessible
- Check browser console for CORS errors

### Database Connection Issues

- Verify `DATABASE_URL` format is correct
- Ensure database is accessible from your hosting platform
- Check if database requires SSL (add `?sslmode=require` to connection string)
- Verify database credentials are correct

### Build Failures

- Check Node.js version compatibility (requires Node 18+)
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors
- Verify environment variables are available during build

### CORS Errors

- Update `FRONTEND_URL` in backend environment variables
- Restart backend after updating CORS settings
- Check that frontend URL matches exactly (including https/http)

## Security Notes

- Never commit `.env` files to Git
- Use strong, random `JWT_SECRET` values (at least 32 characters)
- Rotate API keys regularly
- Use environment-specific secrets
- Enable HTTPS (automatic on most platforms)
- Keep dependencies updated

## Demo Credentials for Submission

When submitting, provide:

- **Frontend URL**: Your deployed frontend URL
- **Backend URL**: Your deployed backend URL (if separate)
- **Demo Credentials**:
  - Email: `demo@example.com` (or your chosen email)
  - Password: `demo123` (or your chosen password)

**Important**: Do not hardcode demo credentials in the repository. Create them through the app or using the provided script after deployment.

## Quick Reference

### Backend Environment Variables
```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
JWT_SECRET=your-secret
PORT=5000
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend Environment Variables
```env
VITE_API_URL=https://your-backend-url.com
```

### Common Commands
```bash
# Backend
cd backend
npm install
npm run db:generate
npm run db:push
npm start

# Frontend
npm install
npm run build
npm run preview
```
