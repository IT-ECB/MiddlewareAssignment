# Fix: Railway Frontend 502 (Gateway Error)

## Why you get 502 on Railway (Vite)

Railway routes traffic to your container on the **port in `$PORT`** and expects your app to listen on **`0.0.0.0`** (not `localhost`).

If Vite runs on localhost or a different port, Railway can't reach it → **502**.

## Correct Railway settings (Frontend service)

- **Root Directory**: `/` (root)
- **Build Command**:
```bash
npm install && npm run build
```
- **Start Command**:
```bash
npm start
```

## What `npm start` does now

In `package.json`, `start` is configured as:
```bash
vite preview --host 0.0.0.0 --port ${PORT:-4173}
```

So on Railway it will bind to `0.0.0.0:$PORT`, and locally it defaults to port `4173`.

## Local note (blank page on preview)

`vite preview` serves the **built** files in `dist/`. So locally you must do:
```bash
npm run build
npm run preview
```

## Environment variables (Frontend)

- **`VITE_API_URL`** = your backend base URL (example: `https://middlewareassignment-production.up.railway.app`)


