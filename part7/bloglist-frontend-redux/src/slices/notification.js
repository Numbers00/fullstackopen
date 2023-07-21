import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    message: '',
    type: ''
  },
  reducers: {
    updateNotification: (state, action) => action.payload,
    clearNotification: () => ({ message: '', type: '' })
  }
});

export const { updateNotification, clearNotification } = notificationSlice.actions;

export const setNotification = (message, type, timeout=5) => {
  return async dispatch => {
    dispatch(updateNotification({ message, type }));
    setTimeout(() => dispatch(clearNotification()), timeout * 1000);
  };
};

export default {
  reducer: notificationSlice.reducer,
  updateNotification,
  clearNotification,
  setNotification
};
