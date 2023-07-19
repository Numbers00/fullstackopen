import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    updateNotification: (state, action) => action.payload,
    removeNotification: () => ''
  }
});

export const { updateNotification, removeNotification } = notificationSlice.actions;

export const setNotification = (message, timeout = 5) => {
  return async dispatch => {
    dispatch(updateNotification(message));
    setTimeout(() => dispatch(removeNotification()), timeout * 1000);
  };
};

export default notificationSlice.reducer;
