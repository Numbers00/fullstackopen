import { createContext, useContext, useReducer } from 'react';

const notificationReducer = (state='', action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION': return action.payload;
  case 'CLEAR_NOTIFICATION': return '';
  default: return '';
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = props => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '');

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

// Custom Hooks should always start with "use"
export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[1];
};

export default NotificationContext;
