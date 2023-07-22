import { Route, Routes } from 'react-router-dom';

import { useEffect } from 'react';

import Blog from './views/Blog';
import Blogs from './views/Blogs';
import Login from './views/Login';
import User from './views/User';
import Users from './views/Users';

import Header from './components/Header';

import { useAuthValue, useInitializeAuth } from './contexts/AuthContext';
import { useNotificationValue } from './contexts/NotificationContext';


const App = () => {
  const { user } = useAuthValue();
  const notification = useNotificationValue();
  const errorMessage = notification.type === 'error' ? notification.message : null;

  const initializeAuth = useInitializeAuth();
  useEffect(() => {
    initializeAuth();
  }, []);

  if (!user)
    return (
      <div>
        <h2>Log in to application</h2>
        { errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span> }
        <Login />
      </div>
    );

  return (
    <div>
      <Header />
      <Routes>
        <Route index element={<Blogs />} />
        <Route path='/blogs/:id' element={<Blog />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/users/:id' element={<User />} />
        <Route path='/users' element={<Users />} />
        <Route path='*' element={<Blogs />} />
      </Routes>
    </div>
  );
};

export default App;