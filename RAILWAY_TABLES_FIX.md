# Fix: Create Database Tables on Railway

## Problem
Prisma tables are not syncing/creating on Railway database.

## Solution: Auto-Sync on Startup (Recommended)

The server now **automatically creates tables** when it starts if they don't exist. This happens automatically in production.

### How It Works
1. Server starts
2. Checks database connection
3. Checks if tables exist
4. If tables don't exist → automatically runs `db:push` to create them
5. Server continues startup

**No action needed** - tables will be created automatically on first deploy!

## Manual Fix (If Auto-Sync Fails)

### Option 1: Using Railway Shell

1. Go to Railway Dashboard → Your **Backend** service
2. Click **"Deployments"** → **"View Logs"** → **"Shell"** (or find "Shell" button)
3. Run:
   ```bash
   cd backend
   npm run db:init
   ```
   Or:
   ```bash
   cd backend
   npm run db:push
   ```

### Option 2: Update Build Command

Add table creation to your Railway build command:

1. Go to Backend service → **Settings** → **Build & Deploy**
2. Update **Build Command** to:
   ```bash
   npm install && npm run db:generate && npm run db:push
   ```
3. Save and redeploy

### Option 3: Use Init Script

1. Railway Shell (as above)
2. Run:
   ```bash
   cd backend
   node scripts/init-db.js
   ```

## Verify Tables Are Created

### Method 1: Check Server Logs
After deployment, check logs. You should see:
```
✅ Database connected successfully
✅ Database schema synced successfully
```

### Method 2: Health Check Endpoint
Visit: `https://your-backend.railway.app/api/health`

Should return:
```json
{
  "status": "ok",
  "database": {
    "connected": true
  }
}
```

### Method 3: Try Creating a User
1. Visit your frontend
2. Try to register a new user
3. If it works, tables are created!

## Troubleshooting

### Error: "Tables still not found after sync"
**Solution:**
1. Check Railway logs for Prisma errors
2. Verify `DATABASE_URL` includes `?sslmode=require`
3. Manually run: `npm run db:push` in Railway Shell

### Error: "Prisma Client not generated"
**Solution:**
1. Run: `npm run db:generate` in Railway Shell
2. Or update build command to include it

### Error: "Permission denied" or "Cannot connect"
**Solution:**
1. Verify PostgreSQL service is running
2. Check `DATABASE_URL` is correctly linked
3. Ensure SSL parameter is included

## Railway Build Command (Recommended)

For Railway, use this build command:
```bash
npm install && npm run db:generate && npm run db:push
```

This ensures:
- ✅ Dependencies installed
- ✅ Prisma Client generated
- ✅ Tables created before server starts

## Environment Variables

Make sure these are set in Railway:
- `DATABASE_URL` (with `?sslmode=require`)
- `OPENAI_API_KEY`
- `JWT_SECRET`
- `PORT=5000`
- `FRONTEND_URL`

## Quick Checklist

- [ ] PostgreSQL service is running
- [ ] `DATABASE_URL` is set and linked
- [ ] Build command includes `db:generate` and `db:push`
- [ ] Server logs show "Database schema synced"
- [ ] Health check endpoint returns success
- [ ] Can create users (tables working)

## Still Not Working?

1. **Check Railway Logs**: Backend service → View Logs
2. **Run Manual Init**: `node scripts/init-db.js` in Railway Shell
3. **Verify DATABASE_URL**: Should include `?sslmode=require`
4. **Check Prisma Version**: Should be compatible with your Node version

