import { useQuery } from '@apollo/client';

import { useEffect } from 'react';

import { FILTERED_BOOKS, ME } from '../requests';


const Recommendations = ({ show }) => {
  const filteredBooksRes = useQuery(FILTERED_BOOKS);
  const filteredBooks = filteredBooksRes.data?.allBooks;

  const meRes = useQuery(ME);
  const me = meRes.data?.me;

  useEffect(() => {
    if (me?.favoriteGenre)
      filteredBooksRes.refetch({ genre: me.favoriteGenre });
  }, [me]); // eslint-disable-line

  if (!show) return null;
  else if (filteredBooksRes.loading || meRes.loading) return <div>loading...</div>;

  return (
    <div>
      <h2>Recommendations</h2>
      <p>books in favorite genre <b>{ me.favoriteGenre }</b></p>
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
    </div>
  );
};

export default Recommendations;
