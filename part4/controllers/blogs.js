const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1,
      id: 1
    })

  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)

  if (blog) {
    response.json(blog)
  } else {
    response
      .status(404)
      .end()
  }
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user

  const body = request.body
  const blog = await new Blog(body)

  const newBlog = new Blog(
    {
      title:  blog.title,
      author: blog.author,
      url:    blog.url,
      likes:  blog.likes || 0,
      user: user._id
    }
  )

  if (!newBlog.title || !newBlog.url) {
    response
      .status(400)
      .json({ error: 'title or url is missing' })
  }

  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response
    .status(201)
    .json(savedBlog)
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(id)
  if (!blog) {
    response
      .status(400)
      .json({ error: `blog with id ${id} is missing` })
  }

  const user = blog.user
  if (!blog.user) {
    response
      .status(404)
      .json({ error: 'blog has invalid user' })
  }

  const newBlog = {
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: user
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, newBlog)
  if (!updatedBlog) {
    response
      .status(404)
      .json({ error: `updated blog with ${id} is missing` })
  }

  response.json(updatedBlog)

})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id
  const user = request.user

  const blog = await Blog.findById(id)
  if (!blog) {
    response
      .status(400)
      .json({ error: `blog with id ${id} is missing` })
  }

  if (!blog.user) {
    response
      .status(404)
      .json({ error: 'blog has invalid user' })
  }

  if (!(blog.user.toString() === user._id.toString())) {
    response
      .status(401)
      .json({ error: 'Unauthorized to delete this blog' })
  } else {
    await Blog.findByIdAndDelete(id)
    response
      .status(204)
      .end()
  }
})

module.exports = blogRouter
