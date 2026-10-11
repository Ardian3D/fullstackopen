const { describe, test } = require('node:test')
const assert = require('node:assert/strict')
const helper = require('../utils/list_helper')

const sampleBlogs = [
  { title: 'A', author: 'Ada', likes: 5 },
  { title: 'B', author: 'Ada', likes: 12 },
  { title: 'C', author: 'Bob', likes: 4 },
]

describe('4.3–4.7 blog list unit tests', () => {
  test('dummy always returns 1', () => {
    assert.equal(helper.dummy([]), 1)
    assert.equal(helper.dummy(sampleBlogs), 1)
  })
  test('totalLikes handles empty list, single blog and several blogs', () => {
    assert.equal(helper.totalLikes([]), 0)
    assert.equal(helper.totalLikes([sampleBlogs[0]]), 5)
    assert.equal(helper.totalLikes(sampleBlogs), 21)
  })
  test('favoriteBlog returns blog with most likes', () => {
    assert.equal(helper.favoriteBlog([]), null)
    assert.deepEqual(helper.favoriteBlog(sampleBlogs), sampleBlogs[1])
  })
  test('mostBlogs returns the most prolific author', () => {
    assert.equal(helper.mostBlogs([]), null)
    assert.deepEqual(helper.mostBlogs(sampleBlogs), { author: 'Ada', blogs: 2 })
  })
  test('mostLikes returns author with highest total likes', () => {
    assert.equal(helper.mostLikes([]), null)
    assert.deepEqual(helper.mostLikes(sampleBlogs), { author: 'Ada', likes: 17 })
  })
})
