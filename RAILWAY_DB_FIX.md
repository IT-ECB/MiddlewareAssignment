# Railway Database Connection Fix

## Problem
```
Can't reach database server at `postgres.railway.internal:5432`
```

## Solution Steps

### Step 1: Verify Database Service is Running

1. Go to your Railway project dashboard
2. Check that your **PostgreSQL** service is running (green status)
3. If it's stopped, click "Deploy" or "Start"

### Step 2: Link Database to Backend Service

1. In Railway dashboard, click on your **Backend** service
2. Go to **Variables** tab
3. Check if `DATABASE_URL` is listed
4. If NOT present:
   - Click **"New Variable"**
   - Railway should auto-suggest `DATABASE_URL` from your PostgreSQL service
   - Select it and add it
   - OR manually add: `DATABASE_URL` = (copy from PostgreSQL service)

### Step 3: Get Correct DATABASE_URL

**Option A: From PostgreSQL Service (Recommended)**
1. Click on your **PostgreSQL** service in Railway
2. Go to **Variables** tab
3. Copy the `DATABASE_URL` value
4. It should look like:
   ```
   postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
   ```

**Option B: Use Railway's Auto-Link**
1. In your Backend service → Variables
2. Click **"Reference Variable"**
3. Select your PostgreSQL service
4. Select `DATABASE_URL`
5. Railway will automatically link them

### Step 4: Add SSL Parameter (Important!)

Railway PostgreSQL requires SSL. Update your `DATABASE_URL`:

**Format:**
```
postgresql://user:password@host:port/database?sslmode=require
```

**Or in Railway Variables:**
- Variable: `DATABASE_URL`
- Value: Your connection string + `?sslmode=require`

**Example:**
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway?sslmode=require
```

### Step 5: Verify Environment Variables

In your Backend service on Railway, ensure these are set:

```
DATABASE_URL=postgresql://...?sslmode=require
OPENAI_API_KEY=sk-...
JWT_SECRET=your-secret-key
PORT=5000
FRONTEND_URL=https://your-frontend.railway.app
```

### Step 6: Redeploy Backend

1. After updating variables, Railway will auto-redeploy
2. Or manually trigger: Click **"Deploy"** → **"Redeploy"**
3. Check the logs to verify connection

### Step 7: Run Database Migrations

After the backend is running, run Prisma migrations:

**Option A: Using Railway Shell**
1. Go to Backend service
2. Click **"View Logs"** → **"Shell"** (or **"Deployments"** → **"View Logs"** → **"Shell"**)
3. Run:
   ```bash
   cd backend
   npm run db:push
   ```

**Option B: Add to Build Command**
Update your Backend service build command to:
```bash
npm install && npm run db:generate && npm run db:push
```

## Common Issues

### Issue 1: "Can't reach database server"
**Cause**: Services not linked or DATABASE_URL not set
**Fix**: Link PostgreSQL service to Backend service (Step 2)

### Issue 2: SSL Connection Error
**Cause**: Missing SSL parameter
**Fix**: Add `?sslmode=require` to DATABASE_URL (Step 4)

### Issue 3: Database Not Found
**Cause**: Migrations not run
**Fix**: Run `npm run db:push` (Step 7)

### Issue 4: Connection Timeout
**Cause**: Database service stopped
**Fix**: Start PostgreSQL service (Step 1)

## Quick Checklist

- [ ] PostgreSQL service is running
- [ ] Backend service has `DATABASE_URL` variable
- [ ] `DATABASE_URL` includes `?sslmode=require`
- [ ] All environment variables are set
- [ ] Backend service is redeployed
- [ ] Database migrations are run (`npm run db:push`)

## Testing Connection

After fixing, test the connection:

1. Visit: `https://your-backend.railway.app/api/health`
2. Should return:
   ```json
   {
     "status": "ok",
     "database": {
       "connected": true
     }
   }
   ```

## Still Not Working?

1. **Check Railway Logs**: Backend service → View Logs
2. **Verify DATABASE_URL Format**: Should include `?sslmode=require`
3. **Check Service Status**: Both services should be green
4. **Try Manual Connection**: Use Railway's database connection details

