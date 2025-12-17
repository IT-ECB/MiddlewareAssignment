# Fix: Railway Start Command Error - Missing Script "start"

## Problem
```
npm error Missing script: "start"
```

Railway is running `npm start` from the root directory instead of the `backend` directory.

## Solution

### Update Start Command in Railway

1. **Go to Railway Dashboard**
   - Railway → Your Project → Backend Service

2. **Open Settings**
   - Click **Settings** tab

3. **Find Start Command**
   - Scroll to **"Build & Deploy"** section
   - Look for **"Start Command"** field

4. **Update Start Command**
   - Change from: `npm start`
   - Change to: `cd backend && npm start`

5. **Save Changes**
   - Railway will automatically redeploy

## Complete Configuration

### Backend Service Settings

**Root Directory**: `backend`

**Build Command**:
```bash
cd backend && npm install && npm run db:generate && npm run db:push
```

**Start Command**:
```bash
cd backend && npm start
```

## Why This Happens

Railway's Start Command runs from the repository root by default, even if Root Directory is set. The `cd backend &&` prefix ensures the command runs in the correct directory.

## Verify It Works

After updating, check Railway logs. You should see:
```
✅ Starting Container
✅ cd backend && npm start
✅ Backend server running on port 5000
```

## Alternative: Use Full Path

If `cd backend &&` doesn't work, you can also try:
```bash
sh -c "cd backend && npm start"
```

## Quick Fix Checklist

- [ ] Root Directory set to: `backend`
- [ ] Build Command: `cd backend && npm install && npm run db:generate && npm run db:push`
- [ ] Start Command: `cd backend && npm start`
- [ ] Saved changes
- [ ] Service redeployed
- [ ] Check logs for successful start

## Still Not Working?

### Check 1: Verify Root Directory
- Settings → Build & Deploy → Root Directory = `backend`

### Check 2: Verify package.json exists
- Make sure `backend/package.json` exists in your repository
- It should have a `"start"` script

### Check 3: Check Railway Logs
- Look for the exact command Railway is running
- Verify it includes `cd backend`

## Summary

**The Fix**: Add `cd backend &&` to your Start Command

**Before**: `npm start`
**After**: `cd backend && npm start`

This ensures Railway runs the start command from the `backend` directory where `package.json` has the `start` script.

