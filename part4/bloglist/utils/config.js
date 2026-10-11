require('dotenv').config()

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_URI_TEST = process.env.MONGODB_URI_TEST
const JWT_SECRET = process.env.JWT_SECRET

const validateRuntimeConfig = () => {
  if (!MONGODB_URI || MONGODB_URI.includes('YOUR_')) {
    throw new Error('Set a real MONGODB_URI in .env first')
  }
  if (!JWT_SECRET || JWT_SECRET.startsWith('REPLACE_') || JWT_SECRET.length < 32) {
    throw new Error('Set JWT_SECRET to a random string with at least 32 characters')
  }
}

module.exports = { PORT, MONGODB_URI, MONGODB_URI_TEST, JWT_SECRET, validateRuntimeConfig }
