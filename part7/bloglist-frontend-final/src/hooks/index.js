import { useMutation, useQuery, useQueryClient } from 'react-query';

import blogService from '../services/blogs';
import userService from '../services/users';

import { useSetNotification } from '../contexts/NotificationContext';


export const useBlogsQuery = () => useQuery('blogs', blogService.getAll);
export const useBlogQuery = id => useQuery(['blogs', id], () => blogService.get(id));

export const useBlogMutations = () => {
  const queryClient = useQueryClient();

  const createdBlogMutation = useMutation(blogService.create, {
    onSuccess: (res, createdBlog) => {
      const blogs = queryClient.getQueryData('blogs');
      queryClient.setQueryData('blogs', blogs.concat(createdBlog));
    },
    onError: err => {
      const setNotification = useSetNotification();
      console.error(err);
      setNotification('Failed to create blog', 'error');
    }
  });

  const likedBlogMutation = useMutation(blogService.update, {
    onSuccess: (res, updatedBlog) => {
      const blogs = queryClient.getQueryData('blogs');
      const updatedBlogs = blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b);
      queryClient.setQueryData('blogs', updatedBlogs);

      queryClient.setQueryData(['blogs', updatedBlog.id], updatedBlog);
    },
    onError: err => {
      const setNotification = useSetNotification();
      console.error(err);
      setNotification('Failed to like blog', 'error');
    }
  });

  const removedBlogMutation = useMutation(blogService.remove, {
    onSuccess: (res, removedBlog) => {
      const blogs = queryClient.getQueryData('blogs');
      queryClient.setQueryData('blogs', blogs.filter(b => b.id !== removedBlog.id));
    },
    onError: err => {
      const setNotification = useSetNotification();
      console.error(err);
      setNotification('Failed to remove blog', 'error');
    }
  });

  return { createdBlogMutation, likedBlogMutation, removedBlogMutation };
};

export const useUsersQuery = () => useQuery('users', userService.getAll);
export const useUserQuery = id => useQuery(['users', id], () => userService.get(id));
