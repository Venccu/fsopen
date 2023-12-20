const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('../utils/blog_api_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')



beforeEach(async () => {

  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  // add one user
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()


})

const api = supertest(app)

describe('GET method', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are correct number of blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('id is implemented correctly', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach( v => {
      expect(v.id).toBeDefined(),
      expect(v._id).toBe(undefined)
    })
  })
})



describe('POST method with authorization', () => {

  test('user can log in and is assigned a token', async () => {

    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)
      .expect('Content-Type', /application\/json/)


    expect(response.body.token).toBeDefined()

  })

  test('valid blog is saved correctly when authorized, with user field defined', async () => {

    const toAdd = {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    }

    // sign user in to get token
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const token = response.body.token

    const result = await api
      .post('/api/blogs')
      .send(toAdd)
      .set('Authorization', 'Bearer '+token)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(n => n.title)
    expect(contents).toContain(
      'First class tests'
    )

    expect(result.body.user).toBeDefined()
  })

  test('valid blog is not saved if unauthorized', async () => {

    const toAdd = {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(toAdd)
      .set('Authorization', '')
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  })

  test('blog with missing likes is saved with default 0', async () => {

    const toAdd = {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      __v: 0
    }
    // sign user in to get token
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const token = response.body.token

    await api
      .post('/api/blogs')
      .send(toAdd)
      .set('Authorization', 'Bearer '+token)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(n => n.title)
    expect(contents).toContain(
      'TDD harms architecture'
    )
    // find blog and inspect number of likes
    const savedBlog = blogsAtEnd.find(v => v.id === '5a422ba71b54a676234d17fb')

    expect(savedBlog.likes).toBe(0)
  })

  test('blog with no url is not saved', async () => {

    const toAdd = {
      _id: '5a422b891b54a676234d17h2',
      title: 'My interesting life',
      author: 'Jack Russel',
      //url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    }
    // sign user in to get token
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const token = response.body.token

    await api
      .post('/api/blogs')
      .send(toAdd)
      .set('Authorization', 'Bearer '+token)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('blog with no title is not saved', async () => {

    const toAdd = {
      _id: '5a422b891b54a676234d17h2',
      //title: 'My interesting life',
      author: 'Jack Russel',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    }
    // sign user in to get token
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const token = response.body.token

    await api
      .post('/api/blogs')
      .send(toAdd)
      .set('Authorization', 'Bearer '+token)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('DELETE with authorization', () => {

  test('a blog can be deleted by authorized user', async () => {
    const blogsAtStart = await helper.blogsInDb()

    // sign user in to get token
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const token = response.body.token

    // post with user token
    const toAdd = {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    }
    await api
      .post('/api/blogs')
      .send(toAdd)
      .set('Authorization', 'Bearer '+token)
      .expect(201)

    const blogToDelete = await Blog.findById(toAdd._id)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'Bearer '+token)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      blogsAtStart.length
    )

    const contents = blogsAtEnd.map(r => r.title)
    expect(contents).not.toContain(blogToDelete.title)
  })

  test('fails with code 401 if unauthorized', async () => {

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(
      blogsAtStart.length
    )
  })

})

describe('update a blog', () => {

  test('update is possible with valid data', async () => {

    const blogsAtStart = await helper.blogsInDb()
    const toUpdate = blogsAtStart[0]

    const body = {
      ...toUpdate,
      likes: 100
    }

    await api
      .put(`/api/blogs/${toUpdate.id}`)
      .send(body)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const content = blogsAtEnd.find(r => r.id === toUpdate.id)

    expect(content.likes).toBe(100)

  })

  test('update fails with status code 400 if id is wrong', async () => {

    await api
      .put('/api/blogs/invalidid')
      .expect(400)

  })

})

describe('when there is initially one user in db', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testuser',
      name: 'Human Person',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode if password is not given', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Person',
      name: 'Superuser',
      //password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must have at least 3 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Person',
      name: 'Superuser',
      password: '12',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must have at least 3 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)

  })

  test('creation fails with proper statuscode and message if username is not given', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      //username: 'Person',
      name: 'Superuser',
      password: '123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed: username: Path `username` is required.')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)

  })
})


afterAll(async () => {
  await mongoose.connection.close()
})