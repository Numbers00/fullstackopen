import { Link } from 'react-router-dom';

import { useAuthValue, useLogout } from '../contexts/AuthContext';
import { useNotificationValue } from '../contexts/NotificationContext';


const TopNav = () => {
  const { user } = useAuthValue();

  const logout = useLogout();
  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ display: 'flex' }}>
      <Link to='/blogs' style={{ marginRight: 8 }}>blogs</Link>
      <Link to='/users' style={{ marginRight: 8 }}>users</Link>
      <span>
        Logged in as {user.username} &nbsp;
        <button type='button' onClick={handleLogout}>Logout</button>
      </span>
    </div>
  );
};


const Header = () => {
  const notification = useNotificationValue();
  const errorMessage = notification.type === 'error' ? notification.message : null;
  const successMessage = notification.type === 'success' ? notification.message : null;

  return (
    <div>
      <TopNav />
      <h2>blogs</h2>
      { successMessage && <span style={{ color: 'green' }}>{successMessage}</span> }
      { errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span> }
    </div>
  );
};

export default Header;
