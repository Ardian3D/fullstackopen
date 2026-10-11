const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process')

const backendDir = path.resolve(__dirname, '..')
const frontendDir = path.resolve(backendDir, '..', 'frontend')
const binary = process.platform === 'win32' ? 'npm.cmd' : 'npm'

// This script works on Windows, macOS and Linux. Install frontend deps first.
const built = spawnSync(binary, ['run', 'build'], {
  cwd: frontendDir,
  shell: process.platform === 'win32',
  stdio: 'inherit',
})
if (built.error || built.status !== 0) {
  console.error('Frontend build failed. Run npm install inside the frontend folder first.')
  process.exit(1)
}
const source = path.join(frontendDir, 'dist')
const target = path.join(backendDir, 'dist')
if (!fs.existsSync(source)) throw new Error('Vite build did not produce dist')
fs.rmSync(target, { recursive: true, force: true })
fs.cpSync(source, target, { recursive: true })
console.log(`Copied production UI into ${target}`)
