import { useQuery } from '@apollo/client';

import { useState } from 'react';

import { ALL_BOOKS } from '../requests';

const Books = (props) => {
  const booksRes = useQuery(ALL_BOOKS);
  const books = booksRes.data?.allBooks;

  const [genreFilter, setGenreFilter] = useState('all genres');

  if (!props.show)
    return null
  else if (booksRes.loading)
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
          {books && books
            .filter(b => genreFilter === 'all genres' || b.genres.includes(genreFilter))
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
        {books && [...new Set(books.map(b => b.genres).flat())].map(g => (
          <button key={g} onClick={() => setGenreFilter(g)}>{g}</button>
        ))}
        <button onClick={() => setGenreFilter('all genres')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
