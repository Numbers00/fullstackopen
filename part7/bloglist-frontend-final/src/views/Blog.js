import { useNavigate, useParams } from 'react-router-dom';

import { useAuthValue } from '../contexts/AuthContext';

import { useBlogQuery, useBlogMutations } from '../hooks';


const Blog = () => {
  const { id: blogId } = useParams();

  const { user } = useAuthValue();

  const blogRes = useBlogQuery(blogId);

  const { likedBlogMutation, removedBlogMutation } = useBlogMutations();
  const likeBlog = blog => {
    const likedBlog = {
      ...blog,
      likes: blog.likes + 1
    };

    likedBlogMutation.mutate(likedBlog);
  };

  const navigate = useNavigate();
  const removeBlog = async blog => {
    const isConfirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`);
    if (!isConfirmed) return;

    removedBlogMutation.mutate(blog, {
      onSuccess: () => {
        navigate('/blogs');
      }
    });
  };

  if (blogRes.isLoading) return <div>Loading blog...</div>;
  else if (blogRes.isError) return <div>Failed to load blog</div>;

  const blog = blogRes.data;
  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <a href={blog.url} target='_blank' rel='noreferrer'>{blog.url}</a>
        <span>
          {blog.likes} likes&nbsp;
          <button type='button' onClick={() => likeBlog(blog)}>
            like
          </button>
        </span>
        <span>
          Added by {blog.user.name}&nbsp;
          {user.id === blog.user.id
            && <button type='button' onClick={() => removeBlog(blog)}>
              remove
            </button>
          }
        </span>
      </div>
    </div>
  );
};

export default Blog;
