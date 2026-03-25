const assert = require('node:assert')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', async() => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  const rootUser = {
    username: 'root',
    password: 'sekret'
  }

  const response = await api
    .post('/api/login')
    .send(rootUser)

  const token = response.body.token

  test('blogs are all returned', async() => {
    const response = await api
      .get('/api/blogs')
      .expect(200)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('specific blog is returned', async() => {
    const response = await api
      .get('/api/blogs')
      .expect(200)

    const contents = response.body.map(blog => blog.title)

    assert(contents.includes('React patterns'))
  })

  describe('blog property', () => {
    test('format is json', async() => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('unique identifier is named id', async() => {
      const hasIds = response => {
        response.body.forEach(blog => {
          if(!('id' in blog)) {
            throw new Error(`blog with title '${blog.title}' has missing id`)
          }
        })
      }
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(hasIds)
    })
  })

  describe('addition of a blog', () => {
    test('succeds with status code 201 with valid data', async() => {

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(helper.newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogs = await helper.blogsInDb()
      assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)

      const blogTitles = blogs.map(blog => blog.title)
      assert(blogTitles.includes(`${helper.newBlog.title}`))
    })

    test('sets property likes to 0 when missing', async() => {

      const hasLikes = request => {
        request.body.forEach(blog => {
          if(!('likes' in blog)) {
            throw new Error('Property likes not found')
          }
        })
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(helper.newBlogNoLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(hasLikes)

      const blogsAtEnd = await helper.blogsInDb()
      const addedNewBlog = blogsAtEnd.find(blog => blog.title === `${helper.newBlog.title}`)

      assert.strictEqual(addedNewBlog.likes, 0)
    })

    test('fails with status code 400 when title and/or url is missing', async() => {

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(helper.newBlogNoTitle)
        .expect(400)

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(helper.newBlogNoUrl)
        .expect(400)
    })

    test.only('fails with status code 401 when when no token is provided', async() => {

      const blogsAtStart = await helper.blogsInDb()
      const token = null

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(helper.newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)

      const blogTitles = blogsAtEnd.map(blog => blog.title)
      assert(!(blogTitles.includes(`${helper.newBlog.title}`)))
    })
  })


  describe('deletion of blog', () => {
    test('succeds with status code 204', async() => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(helper.newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogToDelete = newBlog._body

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'Bearer ' + token)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const IdsAtEnd = blogsAtEnd.map(blog => blog.id)

      assert(!IdsAtEnd.includes(blogToDelete.id))
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
  })

  describe('alteration of blog', () => {
    test('succeds with status code 200', async() => {
      const blogsAtStart = await helper.blogsInDb()
      const firstBlogAtStart = blogsAtStart[0]

      const newBlog = await api
        .post('/api/blogs')
        .send(helper.newBlog)
        .set('Authorization', 'Bearer ' + token)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const user = await User.findOne({ username: rootUser.username }, { username: 1, name: 1 }).lean()
      if (user) {
        user.id = user._id.toString()
        delete user._id
      }

      const updatedBlog = {
        title: firstBlogAtStart.title,
        author: firstBlogAtStart.author,
        url: firstBlogAtStart.url,
        likes: 9000,
        user: user
      }

      await api
        .put(`/api/blogs/${newBlog._body.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const firstBlogAtEnd = blogsAtStart[0]

      assert(updatedBlog.likes !== firstBlogAtEnd.likes)
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })
  })

})

after(async() => {
  await mongoose.connection.close()
  console.log('connection closed')
})
