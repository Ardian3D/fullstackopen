const { spawnSync } = require('node:child_process')
const path = require('node:path')
require('dotenv').config()

const testUri = process.env.MONGODB_URI_TEST
const prodUri = process.env.MONGODB_URI
const secret = process.env.JWT_SECRET
let testDatabase = ''
let productionDatabase = ''
try {
  testDatabase = new URL(testUri).pathname.slice(1)
  productionDatabase = prodUri ? new URL(prodUri).pathname.slice(1) : ''
} catch (_error) {
  // An invalid or missing URI is rejected in the guard below.
}

if (!testUri || !testDatabase || !/test/i.test(testDatabase)
  || testDatabase === productionDatabase || testUri === prodUri || !secret
  || secret.startsWith('REPLACE_') || secret.length < 32) {
  console.error('Aborted. Configure MONGODB_URI_TEST with a separate database whose name contains "test",')
  console.error('plus a long JWT_SECRET. API tests DELETE all data in the TEST database.')
  process.exit(1)
}

const result = spawnSync(process.execPath, [
  '--test', '--test-concurrency=1', path.join('tests', 'blog_api.test.js'),
], { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'test' } })
process.exit(result.status ?? 1)
