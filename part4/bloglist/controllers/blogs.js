const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user', 'username name')
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', 'username name')
  if (!blog) return response.status(404).json({ error: 'blog not found' })
  response.json(blog)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  if (!title || !url || !String(title).trim() || !String(url).trim()) {
    return response.status(400).json({ error: 'title and url are required' })
  }
  const blog = new Blog({ title, author, url, likes, user: request.user._id })
  const savedBlog = await blog.save()
  request.user.blogs.push(savedBlog._id)
  await request.user.save()
  await savedBlog.populate('user', 'username name')
  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  // Exercise 4.14: update likes, title, author and url; never transfer ownership.
  const allowed = ['likes', 'title', 'author', 'url']
  const changes = Object.fromEntries(
    Object.entries(request.body).filter(([field]) => allowed.includes(field))
  )
  const blog = await Blog.findByIdAndUpdate(request.params.id, changes, { new: true, runValidators: true })
    .populate('user', 'username name')
  if (!blog) return response.status(404).json({ error: 'blog not found' })
  response.json(blog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).json({ error: 'blog not found' })
  if (!blog.user || blog.user.toString() !== request.user._id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }
  await Blog.findByIdAndDelete(blog._id)
  request.user.blogs = request.user.blogs.filter(id => id.toString() !== blog._id.toString())
  await request.user.save()
  response.status(204).end()
})

module.exports = blogsRouter
