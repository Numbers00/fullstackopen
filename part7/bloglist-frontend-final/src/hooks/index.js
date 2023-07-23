import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useState } from 'react';

import blogService from '../services/blogs';
import userService from '../services/users';

import { useSetNotification } from '../contexts/NotificationContext';


export const useBlogsQuery = () => useQuery('blogs', blogService.getAll);
export const useBlogQuery = id => useQuery(['blogs', id], () => blogService.get(id));

export const useBlogMutations = () => {
  const queryClient = useQueryClient();

  const setNotification = useSetNotification();

  const createBlogMutation = useMutation(blogService.create, {
    onSuccess: res => {
      const createdBlog = res;
      const blogs = queryClient.getQueryData('blogs');
      if (blogs) queryClient.setQueryData('blogs', blogs.concat(createdBlog));

      setNotification('Blog created successfully', 'success');
    },
    onError: err => {
      console.error(err);

      setNotification('Failed to create blog', 'error');
    }
  });

  const addBlogCommentMutation = useMutation(({ id, comment }) => blogService.addComment(id, comment), {
    onSuccess: res => {
      const blogs = queryClient.getQueryData('blogs');
      const updatedBlog = res;
      if (blogs) {
        const updatedBlogs = blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b);
        queryClient.setQueryData('blogs', updatedBlogs);
      }

      const blog = queryClient.getQueryData(['blogs', updatedBlog.id]);
      queryClient.setQueryData(['blogs', updatedBlog.id], {
        ...blog,
        comments: updatedBlog.comments
      });

      setNotification('Comment added successfully', 'success');
    },
    onError: err => {
      console.error(err);

      setNotification('Failed to add comment', 'error');
    }
  });

  const likeBlogMutation = useMutation(blogService.update, {
    onSuccess: (res, updatedBlog) => {
      const blogs = queryClient.getQueryData('blogs');
      if (blogs) {
        const updatedBlogs = blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b);
        queryClient.setQueryData('blogs', updatedBlogs);
      }

      const blog = queryClient.getQueryData(['blogs', updatedBlog.id]);
      queryClient.setQueryData(['blogs', updatedBlog.id], {
        ...blog,
        likes: updatedBlog.likes
      });

      setNotification('Blog liked successfully', 'success');
    },
    onError: err => {
      console.error(err);

      setNotification('Failed to like blog', 'error');
    }
  });

  const removeBlogMutation = useMutation(blogService.remove, {
    onSuccess: (res, removedBlog) => {
      const blogs = queryClient.getQueryData('blogs');
      if (blogs) queryClient.setQueryData('blogs', blogs.filter(b => b.id !== removedBlog.id));

      setNotification('Blog removed successfully', 'success');
    },
    onError: err => {
      console.error(err);

      setNotification('Failed to remove blog', 'error');
    }
  });

  return { createBlogMutation, addBlogCommentMutation, likeBlogMutation, removeBlogMutation };
};

export const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (e) => setValue(e.target.value);

  const reset = () => setValue('');

  return {
    type,
    value,
    onChange,
    reset
  };
};

export const useUsersQuery = () => useQuery('users', userService.getAll);
export const useUserQuery = id => useQuery(['users', id], () => userService.get(id));
