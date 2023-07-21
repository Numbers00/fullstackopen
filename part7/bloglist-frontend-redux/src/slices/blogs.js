import { createSlice } from '@reduxjs/toolkit';

import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addBlog: (state, action) => [...state, action.payload],
    setBlogs: (state, action) => action.payload,
    editBlog: (state, action) => state.map(b => b.id !== action.payload.id ? b : action.payload),
    removeBlog: (state, action) => state.filter(b => b.id !== action.payload)
  }
});

const { addBlog, setBlogs, editBlog, removeBlog } = blogSlice.actions;

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blog, user) => {
  return async dispatch => {
    const createdBlog = await blogService.create(blog);
    createdBlog.user = user;
    dispatch(addBlog(createdBlog));
  };
};

export const updateBlog = blog => {
  return async dispatch => {
    await blogService.update(blog);
    dispatch(editBlog(blog));
  };
};

export const deleteBlog = id => {
  return async dispatch => {
    await blogService.remove(id);
    dispatch(removeBlog(id));
  };
};

export default {
  reducer: blogSlice.reducer,
  initializeBlogs,
  createBlog,
  updateBlog,
  deleteBlog
};
