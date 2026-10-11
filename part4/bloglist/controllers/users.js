const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')

usersRouter.get('/', async (_request, response) => {
  const users = await User.find({}).populate('blogs', 'title author url likes')
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { name = '', password } = request.body
  const username = typeof request.body.username === 'string' ? request.body.username.trim() : ''
  if (username.length < 3 || typeof password !== 'string' || password.length < 3) {
    return response.status(400).json({ error: 'username and password must each have at least 3 characters' })
  }
  if (await User.exists({ username })) {
    return response.status(400).json({ error: 'username must be unique' })
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const savedUser = await new User({ username, name, passwordHash }).save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter
