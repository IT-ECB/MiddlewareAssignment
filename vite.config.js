import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/config': path.resolve(__dirname, './src/config'),
    },
  },
  server: {
    port: 3000,
  },
  // Needed for Railway: Vite preview blocks unknown Host headers by default.
  // Allow Railway subdomains so `vite preview` works behind Railway routing.
  preview: {
    allowedHosts: [
      'middlewareassignment-production-5b83.up.railway.app',
      '.up.railway.app',
      '.railway.app',
    ],
  },
})

