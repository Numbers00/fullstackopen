import { Button, Form } from 'react-bootstrap';

import { useState } from 'react';

import styled from 'styled-components';

const BlogCreationForm = styled(Form)`
  width: min(100%, 600px);
`;


const CreateBlogForm = (props) => {
  const [newBlog, setNewBlog] = useState({});

  const createBlog = e => {
    e.preventDefault();

    props.createBlog(newBlog);
    setNewBlog({ title: '', author: '', url: '' });
  };

  return (
    <div className='my-3'>
      <BlogCreationForm onSubmit={createBlog}>
        <Form.Group className='d-flex mb-3' controlId='createBlogForm.titleInput'>
          <Form.Label className='me-3'>Title</Form.Label>
          <Form.Control
            type='text'
            value={newBlog.title || ''}
            onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
          />
        </Form.Group>
        <Form.Group className='d-flex mb-3' controlId='createBlogForm.authorInput'>
          <Form.Label className='me-3'>Author</Form.Label>
          <Form.Control
            type='text'
            value={newBlog.author || ''}
            onChange={e => setNewBlog({ ...newBlog, author: e.target.value })}
          />
        </Form.Group>
        <Form.Group className='d-flex mb-3' controlId='createBlogForm.urlInput'>
          <Form.Label className='me-3'>URL</Form.Label>
          <Form.Control
            type='text'
            value={newBlog.url || ''}
            onChange={e => setNewBlog({ ...newBlog, url: e.target.value })}
          />
        </Form.Group>
      </BlogCreationForm>
      <Button
        type='button'
        variant='success'
        onClick={createBlog}
      >
        Create Blog
      </Button>
    </div>
  );
};

export default CreateBlogForm;
