import { createSlice } from '@reduxjs/toolkit';

import blogService from '../services/blogs';
import loginService from '../services/login';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null
  },
  reducers: {
    setAuth: (state, action) => ({ user: action.payload.user, token: action.payload.token }),
    clearAuth: () => ({ user: null, token: null })
  }
});

const { setAuth, clearAuth } = authSlice.actions;

export const initializeAuth = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);

      dispatch(setAuth({ user: user.user, token: user.token }));
    }
  };
};

export const login = (username, password) => {
  return async dispatch => {
    const res = await loginService.login({ username, password });
    blogService.setToken(res.token);

    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(res.data));

    dispatch(setAuth({ user: res.user, token: res.token }));
  };
};

export const logout = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedBlogappUser');
    dispatch(clearAuth());
  };
};

export default {
  reducer: authSlice.reducer,
  initializeAuth,
  login,
  logout
};
