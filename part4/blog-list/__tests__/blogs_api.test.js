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

//remove long timeouts if testing performance/speed
describe('when there is initially some blogs saved', () => {
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

  test('the unique identifier of the returned blogs is "id" not "_id"', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  }, 100000);
});

describe('addition of a blog', () => {
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
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);
    
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).not.toContainEqual(blogToDelete);
  }, 100000);
});

describe('updating a blog', () => {
  test('succeeds and returns status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updatedBlog = {
      'title': blogToUpdate.title,
      'author': blogToUpdate.author,
      'url': blogToUpdate.url,
      'likes': blogToUpdate.likes + 1
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    expect(updatedBlog.likes).toBe(blogsAtEnd.find(blog => blog.id === blogToUpdate.id).likes);
  }, 100000);
});

afterAll(() => {
  mongoose.connection.close();
});
