import { useState } from 'react';

const Blog = ({blog}) => {
  const [isDetailed, setIsDetailed] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex' }}>
        {blog.title}&nbsp;<button type='button' onClick={() => setIsDetailed(!isDetailed)}>{isDetailed ? 'Hide' : 'View'}</button>
      </div>
      <div
        style={{ display: isDetailed ? 'flex' : 'none', flexDirection: 'column' }}
      >
        <span>{blog.url}</span>
        <div style={{ display: 'flex' }}>
          <span>{blog.likes} likes</span>&nbsp;<button type='button'>Like</button>
        </div>
        <span>{blog.author}</span>
      </div>
      <hr />
    </div> 
  ); 
};

export default Blog;