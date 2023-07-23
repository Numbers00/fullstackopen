import 'bootstrap/dist/css/bootstrap.min.css';

import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import { AuthContextProvider } from './contexts/AuthContext';
import { NotificationContextProvider } from './contexts/NotificationContext';

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <AuthContextProvider>
        <Router>
          <App />
        </Router>
      </AuthContextProvider>
    </NotificationContextProvider>
  </QueryClientProvider>
);
