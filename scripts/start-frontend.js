import { spawn } from 'node:child_process'

/**
 * Railway/production-friendly Vite preview starter.
 *
 * Why: `vite preview` binds to localhost by default, so Railway can't reach it.
 * This script binds to 0.0.0.0 and uses Railway's $PORT.
 */

const port = Number(process.env.PORT || 4173)
const host = process.env.HOST || '0.0.0.0'

const viteBin =
  process.platform === 'win32' ? 'node_modules\\.bin\\vite.cmd' : 'node_modules/.bin/vite'

const args = ['preview', '--host', host, '--port', String(port)]

console.log(`🚀 Starting Vite preview on http://${host}:${port}`)

const child = spawn(viteBin, args, {
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code) => process.exit(code ?? 0))
child.on('error', (err) => {
  console.error('❌ Failed to start Vite preview:', err)
  process.exit(1)
})


