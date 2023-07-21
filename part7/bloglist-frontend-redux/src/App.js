import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react';

import Blog from './components/Blog';
import CreateBlogForm from './components/CreateBlogForm';

import blogService from './services/blogs';
import loginService from './services/login';

import blogSlice from './slices/blogs';
import notificationSlice from './slices/notification';

const Togglable = forwardRef((props, refs) => {
  const [isVisible, setIsVisible] = useState(false);

  const showWhenVisible = { display: isVisible ? '' : 'none' };
  const hideWhenVisible = { display: isVisible ? 'none' : '' };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    };
  });

  return (
    <>
      <div style={hideWhenVisible}>
        <button type='button' onClick={() => setIsVisible(true)}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        <button type='button' onClick={() => setIsVisible(false)}>Hide &quot;{props.buttonLabel}&quot;</button>
        {props.children}
      </div>
    </>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
};
Togglable.displayName = 'Togglable';

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
  const blogs = useSelector(({ blogs }) => [...blogs] || []);
  const errorMessage = useSelector(({ notification }) => notification.type === 'error' ? notification.message : '');
  const successMessage = useSelector(({ notification }) => notification.type === 'success' ? notification.message : '');

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user.user);
      blogService.setToken(user.token);
    }
  }, []);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(blogSlice.initializeBlogs());
  }, []);

  const login = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({
        username, password
      });

      blogService.setToken(user.token);

      setUser(user.user);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error(err);
      dispatch(notificationSlice.setNotification('Wrong username or password', 'error'));
    }
  };

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const createBlog = async (newBlog) => {
    try {
      dispatch(blogSlice.createBlog(newBlog, user));

      blogFormRef.current.toggleVisibility();

      dispatch(notificationSlice.setNotification(`Added ${newBlog.title} by ${newBlog.author}`, 'success'));
    } catch (err) {
      console.error(err);
      dispatch(notificationSlice.setNotification('Failed to create blog', 'error'));
    }
  };

  const likeBlog = async blog => {
    try {
      const likedBlog = {
        ...blog,
        likes: blog.likes + 1
      };

      dispatch(blogSlice.updateBlog(likedBlog));
      dispatch(notificationSlice.setNotification(`Liked ${likedBlog.title} by ${likedBlog.author}`, 'success'));
    } catch (err) {
      console.error(err);
      dispatch(notificationSlice.setNotification('Failed to like blog', 'error'));
    }
  };

  const removeBlog = async (id, blog) => {
    try {
      const isConfirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`);
      if (!isConfirmed) return;

      dispatch(blogSlice.deleteBlog(id));
      dispatch(notificationSlice.setNotification(`Removed ${blog.title} by ${blog.author}`, 'success'));
    } catch (err) {
      console.error(err);
      dispatch(notificationSlice.setNotification('Failed to remove blog', 'error'));
    }
  };

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        { errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span> }
        <LoginForm
          login={login}
          username={username} setUsername={setUsername}
          password={password} setPassword={setPassword}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button type='button' onClick={logout}>Logout</button>
      </p>
      { successMessage && <span style={{ color: 'green' }}>{successMessage}</span> }
      { errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span> }
      <Togglable buttonLabel={'Create Blog'} ref={blogFormRef}>
        <CreateBlogForm
          createBlog={createBlog}
        />
      </Togglable>
      <div style={{ marginBottom: 8 }}>
        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} user={user} blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} />
        )}
      </div>
    </div>
  );
};

export default App;