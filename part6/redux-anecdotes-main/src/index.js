import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import anecdoteReducer from './slices/anecdote';
import filterReducer from './slices/filter';

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
