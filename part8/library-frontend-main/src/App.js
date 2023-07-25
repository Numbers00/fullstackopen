import { useApolloClient } from '@apollo/client';

import { useEffect, useState } from 'react';

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Login from './components/Login';
import Recommendations from './components/Recommendations';


const App = () => {
  const client = useApolloClient();

  const [token, setToken] = useState(null);

  const [page, setPage] = useState('authors');

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('library-user-token');
    if (loggedInUserJSON) setToken(loggedInUserJSON);
  }, []);

  const logout = () => {
    setToken(null);
    window.localStorage.removeItem('library-user-token');
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token
          ?
            <>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={() => setPage('recommendations')}>recommendations</button>
              <button onClick={() => logout()}>logout</button>
          </>
          : <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <Login show={page === 'login'} setPage={setPage} setToken={setToken} />
      <Recommendations show={page === 'recommendations'} />
    </div>
  )
};

export default App;
