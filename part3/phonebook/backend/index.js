require('dotenv').config()

const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
const PORT = process.env.PORT || 3001
const staticDirectory = path.join(__dirname, 'dist')

app.use(express.json())
app.use(express.static(staticDirectory))

// Show POST request content for 3.8. Hide submitted numbers in production logs.
morgan.token('post-body', (request) => {
  if (request.method !== 'POST' || process.env.NODE_ENV === 'production') return '-'
  return JSON.stringify(request.body || {})
})
app.use(morgan(':method :url :status :response-time ms :post-body'))

app.get('/health', (_request, response) => {
  response.json({ ok: mongoose.connection.readyState === 1 })
})

app.get('/info', async (_request, response) => {
  const count = await Person.countDocuments({})
  response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date().toString()}</p>`)
})

app.get('/api/persons', async (_request, response) => {
  const persons = await Person.find({})
  response.json(persons)
})

app.get('/api/persons/:id', async (request, response) => {
  const person = await Person.findById(request.params.id)
  if (!person) return response.status(404).end()
  response.json(person)
})

app.delete('/api/persons/:id', async (request, response) => {
  await Person.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

app.post('/api/persons', async (request, response) => {
  const { name, number } = request.body || {}
  if (!name || !number) {
    return response.status(400).json({ error: 'name and number are required' })
  }
  if (typeof name !== 'string' || typeof number !== 'string') {
    return response.status(400).json({ error: 'name and number must be text' })
  }
  const cleanedName = name.trim()
  const existing = await Person.findOne({ name: cleanedName })
  if (existing) return response.status(400).json({ error: 'name must be unique' })

  const saved = await new Person({ name: cleanedName, number: number.trim() }).save()
  response.status(201).json(saved)
})

app.put('/api/persons/:id', async (request, response) => {
  const { number } = request.body || {}
  if (typeof number !== 'string' || !number.trim()) {
    return response.status(400).json({ error: 'number is required' })
  }
  const person = await Person.findById(request.params.id)
  if (!person) return response.status(404).end()
  person.number = number.trim()
  const updated = await person.save() // ensures validators run on updates
  response.json(updated)
})

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
})

// Centralized error handling, including malformed MongoDB ids and validation errors.
app.use((error, _request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  if (error.code === 11000) {
    return response.status(400).json({ error: 'name must be unique' })
  }
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).json({ error: 'invalid JSON' })
  }
  next(error)
})

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing. Configure a MongoDB Atlas connection in .env.')
  }
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

if (require.main === module) {
  start().catch(error => {
    console.error('Startup failed:', error.message)
    process.exitCode = 1
  })
}

module.exports = { app, start }
