import { useState, useEffect } from 'react';
import Blog from './components/Blog';

import blogService from './services/blogs';
import loginService from './services/login';

const LoginForm = (props) => {
  const {
    login,
    username, setUsername,
    password, setPassword,
  } = props;

  return (
    <form onSubmit={login}>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        <label htmlFor='usernameInput'>username</label>&nbsp;
        <input
          id='usernameInput'
          type='text'
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        <label htmlFor='passwordInput'>password</label>&nbsp;
        <input
          id='passwordInput'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button type='submit'>Login</button>
    </form>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({});

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    );
  }, []);

  const login = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({
        username, password
      });
      console.log('user', user);
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <LoginForm
          login={login}
          username={username} setUsername={setUsername}
          password={password} setPassword={setPassword}
        />
      </div>
    )
  };

  const createBlog = async e => {
    e.preventDefault();

    try {
      const createdBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(createdBlog));
      setNewBlog({});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button type='button' onClick={logout}>Logout</button>
      </p>
      <div style={{ marginBottom: 8 }}>
        <h2>create new</h2>
        <form onSubmit={createBlog} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', marginBottom: 8 }}>
            <label htmlFor='titleInput'>title:</label>&nbsp;
            <input
              id='titleInput' 
              type='text'
              value={newBlog.title}
              onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', marginBottom: 8 }}>
            <label htmlFor='authorInput'>author:</label>&nbsp;
            <input
              id='authorInput'
              type='text'
              value={newBlog.author}
              onChange={e => setNewBlog({ ...newBlog, author: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', marginBottom: 8 }}>
            <label htmlFor='urlInput'>url:</label>&nbsp;
            <input
              id='urlInput'
              type='text'
              value={newBlog.url}
              onChange={e => setNewBlog({ ...newBlog, url: e.target.value })}
            />
          </div>
        </form>
        <button type='button' onClick={createBlog}>create</button>
      </div>
      <div style={{ marginBottom: 8 }}>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  );
};

export default App