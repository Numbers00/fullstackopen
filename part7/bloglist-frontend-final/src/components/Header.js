import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';

import { useAuthValue, useLogout } from '../contexts/AuthContext';
import { useNotificationValue } from '../contexts/NotificationContext';

import styled from 'styled-components';


const TopNav = () => {
  const { user } = useAuthValue();

  const logout = useLogout();
  const handleLogout = () => {
    logout();
  };

  if (!user)
    return (
      <Navbar expand='lg' bg='light' data-bs-theme='light'>
        <Container className='px-4'>
          <Navbar.Brand as={Link} to='/'>Blog App</Navbar.Brand>
          <Navbar.Toggle aria-controls='topnav' />
          <Navbar.Collapse id='topnav'>
            <Nav className='w-100 d-flex justify-content-between me-auto'>
              <div className='d-flex'>
                <Nav.Link href='#' disabled>Blogs</Nav.Link>
                <Nav.Link href='#' disabled>Users</Nav.Link>
              </div>
              <div className='d-flex'>
                <Navbar.Text>Login</Navbar.Text>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );

  return (
    <Navbar expand='lg' bg='light' data-bs-theme='light'>
      <Container className='px-4'>
        <Navbar.Brand as={Link} to='/'>Blog App</Navbar.Brand>
        <Navbar.Toggle aria-controls='topnav' />
        <Navbar.Collapse id='topnav'>
          <Nav className='w-100 d-flex justify-content-between me-auto'>
            <div className='d-flex'>
              <Nav.Link as={Link} to='/blogs'>Blogs</Nav.Link>
              <Nav.Link as={Link} to='/users'>Users</Nav.Link>
            </div>
            <div className='d-flex'>
              <Nav.Link as={Link} to={`/users/${user.id}`}>
                <FaUser /> {user.username}
              </Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};


const NotificationDiv = styled.div`
  position: absolute;
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 1.5rem;
  color: white;
`;
const ErrorMessage = styled(NotificationDiv)`background-color: #dc3545;`;
const SuccessMessage = styled(NotificationDiv)`background-color: #198754;`;

const Notification = () => {
  const notification = useNotificationValue();
  const errorMessage = notification.type === 'error' ? notification.message : null;
  const successMessage = notification.type === 'success' ? notification.message : null;

  if (errorMessage && errorMessage.length)
    return (
      <ErrorMessage>
        {errorMessage}
      </ErrorMessage>
    );
  else if (successMessage && successMessage.length)
    return (
      <SuccessMessage>
        {successMessage}
      </SuccessMessage>
    );

  return null;
};

const Header = () => {

  return (
    <div className='position-relative'>
      <TopNav />
      <Notification />
    </div>
  );
};

export default Header;
