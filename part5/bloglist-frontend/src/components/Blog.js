import { useState } from 'react';

const Blog = ({ blog, likeBlog, removeBlog }) => {
  const [isDetailed, setIsDetailed] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex' }}>
        {blog.title} {blog.author}&nbsp;<button type='button' onClick={() => setIsDetailed(!isDetailed)}>{isDetailed ? 'Hide' : 'View'}</button>
      </div>
      <div
        style={{ display: isDetailed ? 'flex' : 'none', flexDirection: 'column' }}
      >
        <span>{blog.url}</span>
        <div style={{ display: 'flex' }}>
          <span>{blog.likes} likes</span>&nbsp;<button type='button' onClick={() => likeBlog(blog.id, blog)}>Like</button>
        </div>
        {(blog.user && blog.user.name)
          ? <span>
              Added by {blog.user.name}&nbsp;
              <button type='button' onClick={() => removeBlog(blog.id, blog)}>Remove</button>
            </span>
          : null
        }
      </div>
      <br />
    </div> 
  ); 
};

export default Blog;