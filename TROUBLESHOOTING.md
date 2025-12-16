# Troubleshooting: Frontend-Backend Connection

## Quick Checklist

1. ✅ **Backend is running** on port 8000
2. ✅ **Frontend is running** on port 3000
3. ✅ **Environment variables** are set correctly
4. ✅ **CORS** is configured properly

## Step-by-Step Debugging

### 1. Check Backend is Running

```bash
curl http://localhost:8000/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Backend API is running",
  "database": { "connected": true }
}
```

### 2. Check Frontend Configuration

Open browser console (F12) and look for:
```
🔧 Frontend API Configuration: { VITE_API_URL: "...", API_BASE_URL: "..." }
```

Should show: `API_BASE_URL: "http://localhost:8000"`

### 3. Check API Calls

When you try to login, check browser console for:
```
🔵 Calling API: http://localhost:8000/api/auth/login
🔵 Response status: 200 (or error code)
```

### 4. Common Issues

#### Issue: "Cannot connect to backend server"
**Solution:**
- Make sure backend is running: `cd backend && npm run dev`
- Check backend is on port 8000 (check terminal output)
- Verify `.env` file in root has: `VITE_API_URL="http://localhost:8000"`

#### Issue: CORS Error
**Solution:**
- Backend CORS is configured to allow `http://localhost:3000`
- If you see CORS errors, restart the backend server

#### Issue: 404 Not Found
**Solution:**
- Check backend is running on the correct port
- Verify API endpoint URLs match (should be `/api/auth/login`, etc.)

#### Issue: Network Error
**Solution:**
- Check if backend server is actually running
- Try accessing `http://localhost:8000/api/health` directly in browser
- Check firewall/antivirus isn't blocking connections

### 5. Verify Environment Variables

**Frontend** (root `.env`):
```env
VITE_API_URL="http://localhost:8000"
```

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://roopansh@localhost:5432/chatbot?schema=public"
OPENAI_API_KEY="your-key"
JWT_SECRET="your-secret"
PORT=8000
FRONTEND_URL="http://localhost:3000"
```

### 6. Test API Manually

```bash
# Test login endpoint
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'
```

### 7. Browser DevTools

1. Open DevTools (F12)
2. Go to **Network** tab
3. Try to login
4. Look for requests to `localhost:8000`
5. Check:
   - Request URL (should be `http://localhost:8000/api/auth/login`)
   - Request Method (should be `POST`)
   - Response Status (200 = success, 401 = wrong credentials, etc.)
   - Response body (check for error messages)

## Quick Fixes

### Restart Everything

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
npm run dev
```

### Clear Browser Cache

- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Or clear browser cache completely

### Check Ports

```bash
# Check what's running on port 8000
lsof -i:8000

# Check what's running on port 3000
lsof -i:3000
```

## Still Not Working?

1. Check browser console for specific error messages
2. Check backend terminal for error logs
3. Verify both servers are running
4. Try accessing backend directly: `http://localhost:8000/api/health`

