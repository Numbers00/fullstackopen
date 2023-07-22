import { useNavigate, useParams } from 'react-router-dom';

import { useAuthValue } from '../contexts/AuthContext';

import { useBlogQuery, useBlogMutations, useField } from '../hooks';


const Blog = () => {
  const { id: blogId } = useParams();

  const { user } = useAuthValue();

  const blogRes = useBlogQuery(blogId);
  const blog = blogRes.data;

  const { reset: resetComment, ...comment } = useField('text');

  const { addBlogCommentMutation, likeBlogMutation, removeBlogMutation } = useBlogMutations();
  const addBlogComment = e => {
    e.preventDefault();

    if (!comment.value) return;

    addBlogCommentMutation.mutate({ id: blog.id, comment: comment.value }, {
      onSuccess: () => {
        resetComment();
      }
    });
  };

  const likeBlog = blog => {
    const likedBlog = {
      ...blog,
      likes: blog.likes + 1
    };

    likeBlogMutation.mutate(likedBlog);
  };

  const navigate = useNavigate();
  const removeBlog = async blog => {
    const isConfirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`);
    if (!isConfirmed) return;

    removeBlogMutation.mutate(blog, {
      onSuccess: () => {
        navigate('/blogs');
      }
    });
  };

  if (blogRes.isLoading) return <div>Loading blog...</div>;
  else if (blogRes.isError) return <div>Failed to load blog</div>;

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
        <h3>comments</h3>
        <form onSubmit={addBlogComment}>
          <input {...comment} style={{ marginRight: 8 }} />
          <button type='submit'>add comment</button>
        </form>
        <ul>
          {blog.comments && blog.comments.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Blog;
