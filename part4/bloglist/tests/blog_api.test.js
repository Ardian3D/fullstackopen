const { test, describe, before, beforeEach, after } = require('node:test')
const assert = require('node:assert/strict')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')
const { connect } = require('../utils/db')

const api = supertest(app)
let alice
let bob
let initialBlogs

before(async () => {
  assert.equal(process.env.NODE_ENV, 'test', 'Never run destructive API tests outside test mode')
  assert(config.MONGODB_URI_TEST && /test/i.test(new URL(config.MONGODB_URI_TEST).pathname))
  await connect(config.MONGODB_URI_TEST)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('password123', 8)
  alice = await new User({ username: 'alice', name: 'Alice Example', passwordHash }).save()
  bob = await new User({ username: 'bob', name: 'Bob Example', passwordHash }).save()
  initialBlogs = await Blog.insertMany([
    { title: 'TDD basics', author: 'Ada', url: 'https://example.com/tdd', likes: 3, user: alice._id },
    { title: 'Node testing', author: 'Bob', url: 'https://example.com/node', likes: 9, user: alice._id },
  ])
  alice.blogs = initialBlogs.map(blog => blog._id)
  await alice.save()
})

after(async () => {
  await mongoose.connection.close()
})

const login = async (username = 'alice') => {
  const response = await api.post('/api/login')
    .send({ username, password: 'password123' }).expect(200)
  return response.body.token
}

describe('4.8–4.14 Blog List API tests', () => {
  test('GET returns initial blogs as JSON', async () => {
    const response = await api.get('/api/blogs').expect(200)
      .expect('Content-Type', /application\/json/)
    assert.equal(response.body.length, 2)
  })
  test('uses id property instead of _id', async () => {
    const response = await api.get('/api/blogs').expect(200)
    assert.equal(typeof response.body[0].id, 'string')
    assert.equal(Object.hasOwn(response.body[0], '_id'), false)
  })
  test('a valid authorized POST increases count by one and identifies user', async () => {
    const token = await login()
    const saved = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`)
      .send({ title: 'New blog', author: 'Ada', url: 'https://example.com/new', likes: 3 })
      .expect(201)
    assert.equal(saved.body.title, 'New blog')
    assert.equal(saved.body.user.username, 'alice')
    assert.equal(await Blog.countDocuments({}), 3)
  })
  test('likes defaults to zero if omitted', async () => {
    const token = await login()
    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`)
      .send({ title: 'No likes', url: 'https://example.com/none' }).expect(201)
    assert.equal(response.body.likes, 0)
  })
  test('missing title or url returns 400 without saving', async () => {
    const token = await login()
    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`)
      .send({ title: 'No URL' }).expect(400)
    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`)
      .send({ url: 'https://example.com/without-title' }).expect(400)
    assert.equal(await Blog.countDocuments({}), 2)
  })
  test('GET blog by id, PUT updated likes', async () => {
    const blogId = initialBlogs[0]._id.toString()
    const found = await api.get(`/api/blogs/${blogId}`).expect(200)
    assert.equal(found.body.title, 'TDD basics')
    const updated = await api.put(`/api/blogs/${blogId}`).send({ likes: 44 }).expect(200)
    assert.equal(updated.body.likes, 44)
  })
  test('invalid id returns 400, missing blog returns 404', async () => {
    await api.get('/api/blogs/invalid').expect(400)
    await api.get(`/api/blogs/${new mongoose.Types.ObjectId()}`).expect(404)
  })
})

describe('4.15–4.23 Users, tokens and permissions', () => {
  test('register returns user without passwordHash; user listing populates blogs', async () => {
    const created = await api.post('/api/users')
      .send({ username: 'charlie', name: 'Charlie', password: 'secret321' }).expect(201)
    assert.equal(created.body.username, 'charlie')
    assert.equal(Object.hasOwn(created.body, 'passwordHash'), false)
    const response = await api.get('/api/users').expect(200)
    const owner = response.body.find(user => user.username === 'alice')
    assert.equal(owner.blogs.length, 2)
    assert.equal(owner.blogs[0].title, 'TDD basics')
  })
  test('username and password constraints plus duplicate username are enforced', async () => {
    await api.post('/api/users').send({ username: 'xx', password: 'password123' }).expect(400)
    await api.post('/api/users').send({ username: 'unique', password: 'xx' }).expect(400)
    await api.post('/api/users').send({ username: 'alice', password: 'password123' }).expect(400)
    assert.equal(await User.countDocuments({}), 2)
  })
  test('login returns a signed token; incorrect password returns 401', async () => {
    const token = await login()
    assert.equal(typeof token, 'string')
    await api.post('/api/login').send({ username: 'alice', password: 'wrong' }).expect(401)
  })
  test('POST without token or with forged token returns 401', async () => {
    const body = { title: 'Private add', url: 'https://example.com/private' }
    await api.post('/api/blogs').send(body).expect(401)
    await api.post('/api/blogs').set('Authorization', 'Bearer forged')
      .send(body).expect(401)
    assert.equal(await Blog.countDocuments({}), 2)
  })
  test('DELETE without token returns 401; wrong owner gets 403', async () => {
    const blogId = initialBlogs[0]._id.toString()
    const otherToken = await login('bob')
    await api.delete(`/api/blogs/${blogId}`).expect(401)
    await api.delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${otherToken}`).expect(403)
    assert.equal(await Blog.countDocuments({}), 2)
  })
  test('creator may delete own blog and user relation is updated', async () => {
    const blogId = initialBlogs[0]._id.toString()
    const token = await login()
    await api.delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`).expect(204)
    assert.equal(await Blog.countDocuments({}), 1)
    const updatedAlice = await User.findById(alice._id)
    assert.equal(updatedAlice.blogs.length, 1)
  })
})
