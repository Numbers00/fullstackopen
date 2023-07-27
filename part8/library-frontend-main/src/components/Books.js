import { useQuery, useSubscription } from '@apollo/client';

import { useEffect, useState } from 'react';

import { updateCache } from '../helpers';

import { ALL_BOOKS, FILTERED_BOOKS, BOOK_ADDED } from '../requests';


const Books = (props) => {
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      window.alert(`New book added: ${addedBook.title}`);
      updateCache(client.cache, { query: ALL_BOOKS }, 'allBooks', addedBook);
      addedBook.genres.forEach(g => {
        const filteredBooksData = client.cache.readQuery({
          query: FILTERED_BOOKS,
          variables: { genre: g },
        });
        if (filteredBooksData) 
          updateCache(client.cache, { query: FILTERED_BOOKS, variables: { genre: g } }, 'allBooks', addedBook);
      });
    }
  });

  const allBooksRes = useQuery(ALL_BOOKS);
  const allBooks = allBooksRes.data?.allBooks;

  const [genreFilter, setGenreFilter] = useState('all genres');

  const filteredBooksRes = useQuery(FILTERED_BOOKS, { variables: { genre: genreFilter } });
  const filteredBooks = filteredBooksRes.data?.allBooks;

  useEffect(() => {
    filteredBooksRes.refetch({ genre: genreFilter });
  }, [genreFilter]); // eslint-disable-line

  if (!props.show)  
    return null
  else if (allBooksRes.loading || filteredBooksRes.loading)
    return <div>loading books...</div>

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks && filteredBooks
            .map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 12 }}>
        {allBooks && [...new Set(allBooks.map(b => b.genres).flat())].map(g => (
          <button
            style={{ marginBottom: 12 }}
            key={g}
            onClick={() => setGenreFilter(g)}
          >
            { g.toLowerCase() }
          </button>
        ))}
        <button style={{ marginBottom: 12 }} onClick={() => setGenreFilter('all genres')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
