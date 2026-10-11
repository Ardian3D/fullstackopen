const dummy = (_blogs) => 1

const totalLikes = blogs => blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)

const favoriteBlog = blogs => blogs.length
  ? blogs.reduce((best, blog) => blog.likes > best.likes ? blog : best)
  : null

const aggregateByAuthor = (blogs, scoreField) => {
  if (!blogs.length) return null
  const totals = new Map()
  for (const blog of blogs) {
    const author = blog.author || ''
    totals.set(author, (totals.get(author) || 0) + (scoreField === 'blogs' ? 1 : (blog.likes || 0)))
  }
  let winner = null
  for (const [author, count] of totals) {
    if (winner === null || count > winner.count) winner = { author, count }
  }
  return { author: winner.author, [scoreField]: winner.count }
}

const mostBlogs = blogs => aggregateByAuthor(blogs, 'blogs')
const mostLikes = blogs => aggregateByAuthor(blogs, 'likes')

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
