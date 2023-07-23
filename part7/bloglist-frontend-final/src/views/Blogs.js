import { Link } from 'react-router-dom';

import CreateBlogForm from '../components/CreateBlogForm';
import Togglable from '../components/Togglable';

import { useRef } from 'react';

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

  const { createBlogMutation } = useBlogMutations();

  const createBlog = async (newBlog) => {
    createBlogMutation.mutate(newBlog);

    blogFormRef.current.toggleVisibility();
  };

  return (
    <div className='mt-5 ms-5'>
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
