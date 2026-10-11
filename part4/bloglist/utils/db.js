const mongoose = require('mongoose')
const logger = require('./logger')

const connect = async (uri) => {
  // Never log an Atlas URI; it contains database credentials.
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 12000, family: 4 })
  logger.info(`Connected to MongoDB database: ${mongoose.connection.name}`)
}

module.exports = { connect }
