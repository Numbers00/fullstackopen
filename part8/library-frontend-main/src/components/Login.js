import { useMutation } from '@apollo/client';

import { useEffect } from 'react';

import { useField } from '../hooks';

import { LOGIN } from '../requests';

const Login = ({ show, setPage, setToken }) => {
  const { reset: resetUsername, ...username } = useField('text');
  const { reset: resetPassword, ...password } = useField('password');

  const [loginReq, loginRes] = useMutation(LOGIN, {
    onError: error => console.log(error.graphQLErrors[0].message),
  });

  useEffect(() => {
    if (loginRes.data) {
      const token = loginRes.data.login.value;
      localStorage.setItem('library-user-token', token);
      setToken(token);
      setPage('authors');
    }
  }, [loginRes.data]); // eslint-disable-line

  const login = ev => {
    ev.preventDefault();

    loginReq({ variables: { username: username.value, password: password.value }});
  };

  if (!show)
    return null;

  return (
    <form onSubmit={login}>
      <div style={{ display: 'flex', marginTop: 12, marginBottom: 12 }}>
        <label htmlFor='username' style={{ marginRight: 8 }}>username</label>
        <input {...username} />
      </div>
      <div style={{ display: 'flex', marginBottom: 12 }}>
        <label htmlFor='password' style={{ marginRight: 8 }}>password</label>
        <input {...password} />
      </div>
      <button type='submit'>login</button>
    </form>
  );
};

export default Login;
