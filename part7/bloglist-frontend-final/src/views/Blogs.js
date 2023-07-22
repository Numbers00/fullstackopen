import Blog from '../components/Blog';
import CreateBlogForm from '../components/CreateBlogForm';
import Togglable from '../components/Togglable';

import { useRef } from 'react';

import Header from '../components/Header';

import { useAuthValue } from '../contexts/AuthContext';
import { useSetNotification } from '../contexts/NotificationContext';

import { useBlogsQuery, useBlogMutations } from '../hooks';

const BlogsList = (props) => {
  const { user, blogsRes, likeBlog, removeBlog } = props;

  if (blogsRes.isLoading) return <div>Loading blogs...</div>;
  else if (blogsRes.isError) return <div>Failed to load blogs</div>;

  const blogs = blogsRes.data;
  return (
    <div style={{ marginBottom: 8 }}>
      {blogs.sort((a, b) => b.likes - a.likes).map((blog, i) =>
        <Blog key={i} user={user} blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} />
      )}
    </div>
  );
};


const Blogs = () => {
  const { user } = useAuthValue();

  const blogFormRef = useRef();

  const blogsRes = useBlogsQuery();

  const { createdBlogMutation, likedBlogMutation, removedBlogMutation } = useBlogMutations();

  const setNotification = useSetNotification();
  const createBlog = async (newBlog) => {
    try {
      createdBlogMutation.mutate(newBlog);

      blogFormRef.current.toggleVisibility();

      setNotification(`Added ${newBlog.title} by ${newBlog.author}`, 'success');
    } catch (err) {
      console.error(err);
      setNotification('Failed to create blog', 'error');
    }
  };

  const likeBlog = async blog => {
    try {
      const likedBlog = {
        ...blog,
        likes: blog.likes + 1
      };

      likedBlogMutation.mutate(likedBlog);
      setNotification(`Liked ${likedBlog.title} by ${likedBlog.author}`, 'success');
    } catch (err) {
      console.error(err);
      setNotification('Failed to like blog', 'error');
    }
  };

  const removeBlog = async blog => {
    try {
      const isConfirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`);
      if (!isConfirmed) return;

      removedBlogMutation.mutate(blog);
      setNotification(`Removed ${blog.title} by ${blog.author}`, 'success');
    } catch (err) {
      console.error(err);
      setNotification('Failed to remove blog', 'error');
    }
  };

  return (
    <div>
      <Header />
      <Togglable buttonLabel={'Create Blog'} ref={blogFormRef}>
        <CreateBlogForm
          createBlog={createBlog}
        />
      </Togglable>
      <BlogsList
        user={user}
        blogsRes={blogsRes}
        likeBlog={likeBlog}
        removeBlog={removeBlog}
      />
    </div>
  );
};

export default Blogs;
