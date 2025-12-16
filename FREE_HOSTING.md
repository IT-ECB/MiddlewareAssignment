# Free Hosting Guide

## Can I Host Everything on GitHub for Free?

**Short Answer: No, but you can host the frontend on GitHub Pages for free!**

## What GitHub Can and Cannot Do

### ✅ What GitHub Offers (Free)
- **GitHub Pages**: Free static site hosting
  - Perfect for your React frontend (after building)
  - Free for public repositories
  - Custom domain support
  - Automatic HTTPS

### ❌ What GitHub Cannot Do
- **No Backend Hosting**: GitHub cannot run Node.js/Express servers
- **No Database Hosting**: GitHub doesn't provide database services

## Free Hosting Solutions

### Recommended: Mix of Free Services

**Best Free Stack:**
- **Frontend**: GitHub Pages (100% free, unlimited)
- **Backend**: Render (free tier) or Railway ($5 credit/month)
- **Database**: Supabase (free tier) or Render PostgreSQL (free tier)

### All-in-One Free Options

**Option 1: Everything on Render** (Recommended for Free)
- ✅ Frontend: Static site (free)
- ✅ Backend: Web service (free tier)
- ✅ Database: PostgreSQL (free tier)
- ⚠️ **Limitation**: Services sleep after 15 minutes of inactivity (free tier)

**Option 2: Everything on Railway**
- ✅ Frontend: Web service (free)
- ✅ Backend: Web service (free)
- ✅ Database: PostgreSQL (free)
- ⚠️ **Limitation**: $5 free credit/month, then pay-as-you-go (~$5-10/month)

## Step-by-Step: Free Hosting Setup

### Setup 1: Frontend on GitHub Pages (Free)

1. **Enable GitHub Actions** (already configured in `.github/workflows/deploy-pages.yml`)

2. **Set Repository Secret:**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `VITE_API_URL`
   - Value: Your backend URL (e.g., `https://your-backend.onrender.com`)

3. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: "GitHub Actions"
   - Save

4. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages"
   git push
   ```

5. **Your site will be live at:**
   - `https://yourusername.github.io/repository-name`
   - Or set a custom domain in Pages settings

### Setup 2: Backend on Render (Free Tier)

1. **Go to [render.com](https://render.com)** and sign up (free)

2. **Create PostgreSQL Database:**
   - Click "New" → "PostgreSQL"
   - Name: `chatbot-db`
   - Plan: Free (sleeps after inactivity)
   - Copy the "Internal Database URL"

3. **Create Web Service (Backend):**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `chatbot-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run db:generate`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     ```
     DATABASE_URL=<Internal Database URL from step 2>
     OPENAI_API_KEY=sk-...
     JWT_SECRET=<generate-random-string>
     PORT=5000
     FRONTEND_URL=https://yourusername.github.io/repository-name
     ```
   - Plan: Free
   - Click "Create Web Service"

4. **Copy Backend URL** (e.g., `https://chatbot-backend.onrender.com`)

5. **Update Frontend Secret:**
   - Go back to GitHub → Settings → Secrets
   - Update `VITE_API_URL` with your Render backend URL

### Setup 3: Database Migrations

1. **In Render Dashboard:**
   - Go to your backend service
   - Click "Shell" (opens terminal)
   - Run:
     ```bash
     cd backend
     npm run db:push
     ```

2. **Create Demo User (Optional):**
   ```bash
   node scripts/create-demo-user.js
   ```

## Free Tier Limitations

### Render Free Tier
- ✅ 750 hours/month (enough for 24/7 if single service)
- ⚠️ Services sleep after 15 min inactivity (first request takes ~30s to wake)
- ✅ PostgreSQL: 90 days retention, 1GB storage

### Railway Free Tier
- ✅ $5 credit/month
- ⚠️ After credit runs out, pay-as-you-go (~$5-10/month for small apps)
- ✅ PostgreSQL included

### Supabase Free Tier
- ✅ 500MB database
- ✅ 2GB bandwidth
- ✅ Unlimited API requests
- ✅ No sleep time

## Cost Comparison

| Service | Frontend | Backend | Database | Monthly Cost |
|---------|----------|---------|----------|--------------|
| GitHub Pages + Render | Free | Free* | Free* | **$0** |
| GitHub Pages + Railway | Free | $5 credit | Included | **$0-10** |
| All on Render | Free* | Free* | Free* | **$0** |
| All on Railway | Free | $5 credit | Included | **$0-10** |

*Free tier has limitations (sleep time, etc.)

## Recommended Setup for Students

**Best Free Option:**
1. **Frontend**: GitHub Pages (unlimited, no sleep)
2. **Backend**: Render (free tier, sleeps but works)
3. **Database**: Supabase (free tier, no sleep) OR Render PostgreSQL

**Why?**
- GitHub Pages never sleeps
- Supabase database never sleeps
- Only backend sleeps (acceptable for demos/projects)
- 100% free

## Troubleshooting Free Tiers

### Render Services Sleeping
- **Issue**: First request takes 30+ seconds
- **Solution**: Acceptable for demos, or upgrade to paid plan

### Railway Credit Running Out
- **Issue**: Services stop after $5 credit
- **Solution**: Monitor usage, or switch to Render free tier

### GitHub Pages Build Failing
- **Issue**: Build errors in Actions
- **Solution**: Check `VITE_API_URL` secret is set correctly

## Next Steps

1. Choose your hosting stack
2. Follow the setup steps above
3. Test your deployment
4. Share your live URL!

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

