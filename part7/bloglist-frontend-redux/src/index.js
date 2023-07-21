import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import notificationReducer from './slices/notification';

const store = configureStore({
  reducer: {
    notification: notificationReducer
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);