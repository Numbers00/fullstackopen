import { Button, Container, Form } from 'react-bootstrap';

import { useLogin } from '../contexts/AuthContext';
import { useSetNotification } from '../contexts/NotificationContext';

import { useField } from '../hooks';

import styled from 'styled-components';

const LoginForm = styled(Form)`
  width: min(100%, 400px);
`;


const Login = () => {
  const { reset: resetUsername, ...username } = useField('text');
  const { reset: resetPassword, ...password } = useField('password');

  const setNotification = useSetNotification();
  const login = useLogin();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(username.value, password.value);
      resetUsername();
      resetPassword();
    } catch (err) {
      console.error(err);
      setNotification('Wrong username or password', 'error');
    }
  };

  return (
    <Container className='d-flex justify-content-center mt-5'>
      <LoginForm onSubmit={handleLogin}>
        <Form.Group className='text-center fs-5 mb-2' controlId='loginForm.usernameInput'>
          <Form.Label>username</Form.Label>
          <Form.Control {...username} />
        </Form.Group>
        <Form.Group className='text-center fs-5 mb-3' controlId='loginForm.passwordInput'>
          <Form.Label>password</Form.Label>
          <Form.Control {...password} />
        </Form.Group>
        <Button
          type='submit'
          variant='success'
          className='w-100'
          disabled={!username.value || !password.value}
        >
          Login
        </Button>
      </LoginForm>
    </Container>
  );
};

export default Login;
