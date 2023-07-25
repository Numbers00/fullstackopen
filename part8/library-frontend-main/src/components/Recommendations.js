import { useQuery } from '@apollo/client';

import { ALL_BOOKS, ME } from '../requests';

const Recommendations = ({ show }) => {
  const booksRes = useQuery(ALL_BOOKS);
  const books = booksRes.data?.allBooks;

  const meRes = useQuery(ME);
  const me = meRes.data?.me;

  if (!show) return null;
  else if (booksRes.loading || meRes.loading) return <div>loading...</div>;

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
          {books && books
            .filter(b => b.genres.includes(me.favoriteGenre))
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
