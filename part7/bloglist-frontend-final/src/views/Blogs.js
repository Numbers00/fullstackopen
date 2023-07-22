import { Link } from 'react-router-dom';

import CreateBlogForm from '../components/CreateBlogForm';
import Togglable from '../components/Togglable';

import { useRef } from 'react';

import { useSetNotification } from '../contexts/NotificationContext';

import { useBlogsQuery, useBlogMutations } from '../hooks';


const BlogsList = (props) => {
  const { blogsRes } = props;

  if (blogsRes.isLoading) return <div>Loading blogs...</div>;
  else if (blogsRes.isError) return <div>Failed to load blogs</div>;

  const blogs = blogsRes.data;
  return (
    <ul>
      {blogs.sort((a, b) => b.likes - a.likes).map((blog, i) =>
        <li key={i}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} by {blog.author}
          </Link>
        </li>
      )}
    </ul>
  );
};


const Blogs = () => {
  const blogFormRef = useRef();

  const blogsRes = useBlogsQuery();

  const { createdBlogMutation } = useBlogMutations();

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

  return (
    <div>
      <Togglable buttonLabel={'Create Blog'} ref={blogFormRef}>
        <CreateBlogForm
          createBlog={createBlog}
        />
      </Togglable>
      <BlogsList
        blogsRes={blogsRes}
      />
    </div>
  );
};

export default Blogs;
