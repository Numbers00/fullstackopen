import { useQuery } from '@apollo/client';

import { useEffect, useState } from 'react';

import { ALL_BOOKS, FILTERED_BOOKS } from '../requests';

const Books = (props) => {
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
      <div style={{ display: 'flex', marginTop: 12 }}>
        {allBooks && [...new Set(allBooks.map(b => b.genres).flat())].map(g => (
          <button key={g} onClick={() => setGenreFilter(g)}>{g.toLowerCase()}</button>
        ))}
        <button onClick={() => setGenreFilter('all genres')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
