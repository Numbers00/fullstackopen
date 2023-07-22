import { useState } from 'react';

import { useLogin } from '../contexts/AuthContext';
import { useSetNotification } from '../contexts/NotificationContext';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

export default Login;
