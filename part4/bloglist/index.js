const app = require('./app')
const config = require('./utils/config')
const db = require('./utils/db')
const logger = require('./utils/logger')

const start = async () => {
  config.validateRuntimeConfig()
  await db.connect(config.MONGODB_URI)
  app.listen(config.PORT, () => logger.info(`Blog List API running on port ${config.PORT}`))
}

start().catch(error => {
  logger.error('Startup failed:', error.message)
  process.exitCode = 1
})
