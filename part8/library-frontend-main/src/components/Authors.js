import { useQuery } from '@apollo/client';

import { ALL_AUTHORS } from '../requests';


const Authors = (props) => {
  const authorsRes = useQuery(ALL_AUTHORS);
  
  if (!props.show)
    return null
  else if (authorsRes.loading)
    return <div>loading authors...</div>

  const authors = authorsRes.data.allAuthors;
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Authors;
