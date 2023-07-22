import PropTypes from 'prop-types';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react';

import Blog from './components/Blog';
import CreateBlogForm from './components/CreateBlogForm';

import blogService from './services/blogs';

import { useAuthValue, useInitializeAuth, useLogin, useLogout } from './contexts/AuthContext';
import { useNotificationValue, useSetNotification } from './contexts/NotificationContext';

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
    handleLogin,
    username, setUsername,
    password, setPassword,
  } = props;

  return (
    <form onSubmit={handleLogin}>
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

const Blogs = (props) => {
  const { user, blogsRes, likeBlog, removeBlog } = props;

  if (blogsRes.isLoading) return <div>Loading blogs...</div>;
  else if (blogsRes.isError) return <div>Failed to load blogs</div>;

  const blogs = blogsRes.data;
  return (
    <div style={{ marginBottom: 8 }}>
      {blogs.sort((a, b) => b.likes - a.likes).map((blog, i) =>
        <Blog key={i} user={user} blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} />
      )}
    </div>
  );
};


const App = () => {
  const notification = useNotificationValue();
  const errorMessage = notification.type === 'error' ? notification.message : null;
  const successMessage = notification.type === 'success' ? notification.message : null;

  const queryClient = useQueryClient();
  const blogsRes = useQuery('blogs', blogService.getAll);
  const createdBlogMutation = useMutation(blogService.create, {
    onSuccess: (res, createdBlog) => {
      createdBlog.user = user;
      const blogs = queryClient.getQueryData('blogs');
      queryClient.setQueryData('blogs', blogs.concat(createdBlog));
    }
  });
  const likedBlogMutation = useMutation(blogService.update, {
    onSuccess: (res, updatedBlog) => {
      const blogs = queryClient.getQueryData('blogs');
      const updatedBlogs = blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b);
      queryClient.setQueryData('blogs', updatedBlogs);
    }
  });
  const removedBlogMutation = useMutation(blogService.remove, {
    onSuccess: (res, removedBlog) => {
      const blogs = queryClient.getQueryData('blogs');
      queryClient.setQueryData('blogs', blogs.filter(b => b.id !== removedBlog.id));
    }
  });

  const { user } = useAuthValue();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const blogFormRef = useRef();

  const initializeAuth = useInitializeAuth();
  useEffect(() => {
    initializeAuth();
  }, []);

  const setNotification = useSetNotification();
  const login = useLogin();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(username, password);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error(err);
      setNotification('Wrong username or password', 'error');
    }
  };

  const logout = useLogout();
  const handleLogout = () => {
    logout();
  };

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

  const likeBlog = async blog => {
    try {
      const likedBlog = {
        ...blog,
        likes: blog.likes + 1
      };

      likedBlogMutation.mutate(likedBlog);
      setNotification(`Liked ${likedBlog.title} by ${likedBlog.author}`, 'success');
    } catch (err) {
      console.error(err);
      setNotification('Failed to like blog', 'error');
    }
  };

  const removeBlog = async blog => {
    try {
      const isConfirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`);
      if (!isConfirmed) return;

      removedBlogMutation.mutate(blog);
      setNotification(`Removed ${blog.title} by ${blog.author}`, 'success');
    } catch (err) {
      console.error(err);
      setNotification('Failed to remove blog', 'error');
    }
  };

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        { errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span> }
        <LoginForm
          handleLogin={handleLogin}
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
        {user.name} logged in <button type='button' onClick={handleLogout}>Logout</button>
      </p>
      { successMessage && <span style={{ color: 'green' }}>{successMessage}</span> }
      { errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span> }
      <Togglable buttonLabel={'Create Blog'} ref={blogFormRef}>
        <CreateBlogForm
          createBlog={createBlog}
        />
      </Togglable>
      <Blogs
        user={user}
        blogsRes={blogsRes}
        likeBlog={likeBlog}
        removeBlog={removeBlog}
      />
    </div>
  );
};

export default App;