import { createContext, useContext, useReducer } from 'react';

import blogService from '../services/blogs';
import loginService from '../services/login';


const initialState = {
  user: null,
  token: null
};

const authReducer = (state=initialState, action) => {
  switch (action.type) {
  case 'SET_AUTH': return { user: action.payload.user, token: action.payload.token };
  case 'CLEAR_AUTH': return initialState;
  default: return state;
  }
};

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [auth, authDispatch] = useReducer(authReducer, initialState);

  const setAuth = (user, token) => {
    authDispatch({ type: 'SET_AUTH', payload: { user, token } });
  };

  const clearAuth = () => {
    authDispatch({ type: 'CLEAR_AUTH' });
  };

  const initializeAuth = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const { user, token } = JSON.parse(loggedUserJSON);
      setAuth(user, token);

      blogService.setToken(token);
    }
  };

  const login = async (username, password) => {
    const loginRes = await loginService.login({ username, password });
    setAuth(loginRes.user, loginRes.token);

    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loginRes));
    blogService.setToken(loginRes.token);
  };

  const logout = () => {
    clearAuth();
    window.localStorage.removeItem('loggedBlogappUser');
  };

  return (
    <AuthContext.Provider value={[ auth, authDispatch, { setAuth, clearAuth, initializeAuth, login, logout } ]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthValue = () => {
  const authContext = useContext(AuthContext);
  return authContext[0];
};

export const useAuthDispatch = () => {
  const authContext = useContext(AuthContext);
  return authContext[1];
};

export const useSetAuth = () => {
  const authContext = useContext(AuthContext);
  return authContext[2].setAuth;
};

export const useClearAuth = () => {
  const authContext = useContext(AuthContext);
  return authContext[2].clearAuth;
};

export const useInitializeAuth = () => {
  const authContext = useContext(AuthContext);
  return authContext[2].initializeAuth;
};

export const useLogin = () => {
  const authContext = useContext(AuthContext);
  return authContext[2].login;
};

export const useLogout = () => {
  const authContext = useContext(AuthContext);
  return authContext[2].logout;
};

export default AuthContext;
