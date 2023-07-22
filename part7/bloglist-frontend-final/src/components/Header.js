import { Link } from 'react-router-dom';

import { useAuthValue, useLogout } from '../contexts/AuthContext';
import { useNotificationValue } from '../contexts/NotificationContext';


const TopNav = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Link to='/blogs' style={{ marginRight: 8 }}>blogs</Link>
      <Link to='/users' style={{ marginRight: 8 }}>users</Link>
    </div>
  );
};


const Header = () => {
  const { user } = useAuthValue();
  const notification = useNotificationValue();
  const errorMessage = notification.type === 'error' ? notification.message : null;
  const successMessage = notification.type === 'success' ? notification.message : null;

  const logout = useLogout();
  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <TopNav />
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button type='button' onClick={handleLogout}>Logout</button>
      </p>
      { successMessage && <span style={{ color: 'green' }}>{successMessage}</span> }
      { errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span> }
    </div>
  );
};

export default Header;
