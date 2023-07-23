import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';

import { useEffect } from 'react';

import Blog from './views/Blog';
import Blogs from './views/Blogs';
import Login from './views/Login';
import User from './views/User';
import Users from './views/Users';

import Header from './components/Header';

import { useAuthValue, useInitializeAuth } from './contexts/AuthContext';


const App = () => {
  const { user } = useAuthValue();

  const initializeAuth = useInitializeAuth();
  useEffect(() => {
    initializeAuth();
  }, []);

  if (!user)
    return (
      <Container>
        <Header />
        <Login />
      </Container>
    );

  return (
    <Container>
      <Header />
      <Routes>
        <Route index element={<Blogs />} />
        <Route path='/blogs/:id' element={<Blog />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/users/:id' element={<User />} />
        <Route path='/users' element={<Users />} />
        <Route path='*' element={<Blogs />} />
      </Routes>
    </Container>
  );
};

export default App;