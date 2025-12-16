# Quick Fix: Railway Database Connection

## The Error
```
Can't reach database server at `postgres.railway.internal:5432`
```

## Quick Fix (3 Steps)

### Step 1: Link Database to Backend
1. Railway Dashboard → Your **Backend** service
2. **Variables** tab → Click **"New Variable"**
3. Select **"Reference Variable"** → Choose your **PostgreSQL** service → Select `DATABASE_URL`
4. This auto-links the database

### Step 2: Add SSL Parameter
1. Still in Backend **Variables** tab
2. Find `DATABASE_URL` variable
3. Edit it and add `?sslmode=require` at the end
4. Example: `postgresql://...?sslmode=require`

### Step 3: Redeploy & Run Migrations
1. Railway will auto-redeploy after variable change
2. Go to Backend service → **Shell** (or **Deployments** → **View Logs** → **Shell**)
3. Run: `cd backend && npm run db:push`

## Done! ✅

Your backend should now connect to the database.

## Still Not Working?

Check:
- [ ] PostgreSQL service is **running** (green status)
- [ ] `DATABASE_URL` includes `?sslmode=require`
- [ ] Backend service is in the **same project** as PostgreSQL
- [ ] Migrations are run (`npm run db:push`)

For detailed troubleshooting, see [RAILWAY_DB_FIX.md](./RAILWAY_DB_FIX.md)

