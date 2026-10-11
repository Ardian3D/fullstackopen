const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('./config')
const logger = require('./logger')

const requestLogger = (request, _response, next) => {
  logger.info(`${request.method} ${request.path}`)
  next()
}

const tokenExtractor = (request, _response, next) => {
  const authorization = request.get('authorization')
  request.token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null
  next()
}

const userExtractor = async (request, response, next) => {
  if (!request.token) return response.status(401).json({ error: 'token missing' })
  // Express 5 forwards thrown errors to error middleware automatically.
  const decoded = jwt.verify(request.token, config.JWT_SECRET)
  if (!decoded.id) return response.status(401).json({ error: 'invalid token' })
  const user = await User.findById(decoded.id)
  if (!user) return response.status(401).json({ error: 'user not found' })
  request.user = user
  next()
}

const unknownEndpoint = (_request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (error, _request, response, _next) => {
  // Avoid emitting DB connection URLs or credentials in responses/logging.
  if (error.name === 'ValidationError') return response.status(400).json({ error: error.message })
  if (error.name === 'CastError') return response.status(400).json({ error: 'malformatted id' })
  if (error.code === 11000) return response.status(400).json({ error: 'username must be unique' })
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token invalid or expired' })
  }
  logger.error('Request processing error:', error.name)
  response.status(500).json({ error: 'internal server error' })
}

module.exports = { requestLogger, tokenExtractor, userExtractor, unknownEndpoint, errorHandler }
