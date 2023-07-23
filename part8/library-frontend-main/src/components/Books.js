import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../requests';

const Books = (props) => {
  const booksRes = useQuery(ALL_BOOKS);
  const books = booksRes.data?.allBooks;

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
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
