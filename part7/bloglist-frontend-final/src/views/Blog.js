import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuthValue } from '../contexts/AuthContext';

import { useBlogQuery, useBlogMutations, useField } from '../hooks';

import styled from 'styled-components';

const AddCommentForm = styled(Form)`
  width: min(100%, 600px);
`;


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
    <div className='mt-5 ms-5'>
      <h2>{blog.title} by {blog.author}</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <p><a href={blog.url} target='_blank' rel='noreferrer'>{blog.url}</a></p>
        <p>
          {blog.likes} likes&nbsp;
          <Button
            type='button'
            variant='primary'
            onClick={() => likeBlog(blog)}
          >
            like
          </Button>
        </p>
        <p>
          Added by {blog.user.name}&nbsp;
          {user.id === blog.user.id
            && <Button
              type='button'
              variant='danger'
              onClick={() => removeBlog(blog)}
            >
              remove
            </Button>
          }
        </p>
        <h3>comments</h3>
        <AddCommentForm className='d-flex' onSubmit={addBlogComment}>
          <Form.Control className='h-100 me-2' {...comment} />
          <Button
            type='submit'
            variant='success'
            className='flex-shrink-0 h-100'
          >
            Add Comment
          </Button>
        </AddCommentForm>
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
