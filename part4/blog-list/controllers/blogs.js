const blogsRouter = require('express').Router();

const Blog = require('../models/blog.js');

const middleware = require('../utils/middleware.js');

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', { id: 1, username: 1, name: 1 });
    response.json(blogs);
  } catch (err) {
    console.log(err);
    response.status(500).end();
  }
});

blogsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog
      .findById(request.params.id)
      .populate('user', { id: 1, username: 1, name: 1 });
    response.json(blog);
  } catch (err) {
    console.log(err);
    response.status(500).end();
  }
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  try {
    const body = request.body;
    if (!('title' in body) || !('url' in body)) {
      return response.status(400).end();
    }

    const user = request.user;

    const blog = new Blog({
      'title': body.title,
      'author': body.author,
      'url': body.url,
      'likes': body.likes || 0,
      'user': user.id
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (err) {
    console.log(err);
    response.status(500).end();
  }
});

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  try {
    const body = request.body;
    if (!('title' in body) || !('url' in body)) {
      return response.status(400).end();
    }

    const blog = {
      'title': body.title,
      'author': body.author,
      'url': body.url,
      'likes': body.likes
    };
    await Blog.findByIdAndUpdate(
      request.params.id,
      blog,
      { new: true, runValidators: true, context: 'query' }
    );
    response.status(200).json(blog);
  } catch (err) {
    console.log(err);
    response.status(500).end();
  }
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog.user.toString() != request.user.id.toString()) {
      return response.status(401).json({ error: 'you are not authorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  }  catch (err) {
    console.log(err);
    response.status(500).end();
  }
});

module.exports = blogsRouter;
