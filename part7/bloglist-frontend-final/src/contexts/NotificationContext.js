import { createContext, useContext, useReducer } from 'react';

const initialState = {
  message: '',
  type: ''
};

const notificationReducer = (state=initialState, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION': return action.payload;
  case 'CLEAR_NOTIFICATION': return initialState;
  default: return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '');

  const setNotification = (message, type, timeout=5) => {
    notificationDispatch({ type: 'SET_NOTIFICATION', payload: { message, type } });
    setTimeout(() => notificationDispatch({ type: 'CLEAR_NOTIFICATION' }), timeout * 1000);
  };

  const clearNotification = () => {
    notificationDispatch({ type: 'CLEAR_NOTIFICATION' });
  };

  return (
    <NotificationContext.Provider value={[ notification, notificationDispatch, { setNotification, clearNotification } ]}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationValue = () => {
  const notificationContext = useContext(NotificationContext);
  return notificationContext[0];
};

export const useNotificationDispatch = () => {
  const notificationContext = useContext(NotificationContext);
  return notificationContext[1];
};

export const useSetNotification = () => {
  const notificationContext = useContext(NotificationContext);
  return notificationContext[2].setNotification;
};

export const useClearNotification = () => {
  const notificationContext = useContext(NotificationContext);
  return notificationContext[2].clearNotification;
};

export default NotificationContext;
