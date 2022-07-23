const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app.js');
const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
  const promiseArr = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArr);
});

//remove long timeout if testing performance/speed
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 100000);

test('the correct amount of blog posts are returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(helper.initialBlogs.length);
}, 100000);

test('HTTP POST successfully creates a new blog post', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'new author',
    url: 'http://newsite.com',
    likes: 0
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  expect(blogsAtEnd).toContainEqual(response.body);
}, 100000);

test('HTTP POST requests for blogs that do not contain "likes" will have it default to 0', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'new author',
    url: 'http://newsite.com'
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const latestBlog = blogsAtEnd[blogsAtEnd.length-1];
  expect(latestBlog.likes).toBe(0);
}, 100000);

test('HTTP POST requests for blogs that do not contain "title" or "url" will return status code 400', async () => {
  const newBlog = {
    url: 'http://newsite.com',
    likes: 4
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
}, 100000);

afterAll(() => {
  mongoose.connection.close();
});

test('the unique identifier of the returned blogs is "id" not "_id"', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body[0].id).toBeDefined();
});
