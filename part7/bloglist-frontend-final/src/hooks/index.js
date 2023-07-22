import { useMutation, useQuery, useQueryClient } from 'react-query';

import blogService from '../services/blogs';
import userService from '../services/users';

export const useBlogsQuery = () => {
  return useQuery('blogs', blogService.getAll);
};

export const useBlogMutations = () => {
  const queryClient = useQueryClient();

  const createdBlogMutation = useMutation(blogService.create, {
    onSuccess: (res, createdBlog) => {
      const blogs = queryClient.getQueryData('blogs');
      queryClient.setQueryData('blogs', blogs.concat(createdBlog));
    }
  });

  const likedBlogMutation = useMutation(blogService.update, {
    onSuccess: (res, updatedBlog) => {
      const blogs = queryClient.getQueryData('blogs');
      const updatedBlogs = blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b);
      queryClient.setQueryData('blogs', updatedBlogs);
    }
  });

  const removedBlogMutation = useMutation(blogService.remove, {
    onSuccess: (res, removedBlog) => {
      const blogs = queryClient.getQueryData('blogs');
      queryClient.setQueryData('blogs', blogs.filter(b => b.id !== removedBlog.id));
    }
  });

  return { createdBlogMutation, likedBlogMutation, removedBlogMutation };
};

export const useUsersQuery = () => {
  return useQuery('users', userService.getAll);
};

export const useUserQuery = id => {
  return useQuery(['users', id], () => userService.get(id));
};
