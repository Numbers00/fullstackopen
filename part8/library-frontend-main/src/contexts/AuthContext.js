// import { createContext, useContext, useReducer } from 'react';


// const initialState = {
//   user: null,
//   token: null
// };

// const authReducer = (state=initialState, action) => {
//   switch (action.type) {
//   case 'SET_AUTH': return { user: action.payload.user, token: action.payload.token };
//   case 'CLEAR_AUTH': return initialState;
//   default: return state;
//   }
// };

// const AuthContext = createContext();

// export const AuthContextProvider = ({ children }) => {
//   const [auth, authDispatch] = useReducer(authReducer, initialState);

//   const setAuth = (user, token) => authDispatch({ type: 'SET_AUTH', payload: { user, token } });
//   const clearAuth = () => authDispatch({ type: 'CLEAR_AUTH' });
//   const initializeAuth = () => {
//     const loggedInUserJSON = window.localStorage.getItem('library-user-token');
//     if (loggedInUserJSON) {
//       const { user, token } = JSON.parse(loggedInUserJSON);
//       setAuth(user, token);
//     }
//   };

//   const login = async (username, password) => {

//   };
// };
