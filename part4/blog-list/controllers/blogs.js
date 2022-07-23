const blogsRouter = require('express').Router();
const Blog = require('../models/blog.js');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  if (!('title' in body) || !('url' in body)) {
    return response.status(400).end();
  }
  
  const blog = new Blog(body);
  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogsRouter;
