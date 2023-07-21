import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import authSlice from './slices/auth';
import blogSlice from './slices/blogs';
import notificationSlice from './slices/notification';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    blogs: blogSlice.reducer,
    notification: notificationSlice.reducer
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);