import { useMutation, useQuery } from '@apollo/client';

import { useField } from '../hooks';

import { ALL_AUTHORS, UPDATE_BIRTHYEAR } from '../requests';


const Authors = (props) => {
  const authorsRes = useQuery(ALL_AUTHORS);
  const authors = authorsRes.data?.allAuthors;

  const [updateBirthyear] = useMutation(UPDATE_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  });

  const { reset: resetName, ...name } = useField('text');
  const { reset: resetBirthyear, ...birthyear } = useField('number');
  const changeBirthyear = e => {
    e.preventDefault();
    updateBirthyear({ variables: { name: name.value, setBornTo: parseInt(birthyear.value) } });
    resetName();
    resetBirthyear();
  };
  
  if (!props.show)
    return null
  else if (authorsRes.loading)
    return <div>loading authors...</div>

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
      <h3>Set birthyear</h3>
      <form onSubmit={changeBirthyear}>
        <div style={{ display: 'flex', marginBottom: 12 }}>
          <label htmlFor='nameSelect' style={{ marginRight: 8 }}>name</label>
          <select id='nameSelect' value={name.value} onChange={name.onChange}>
            {authors.map(a => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', marginBottom: 12 }}>
          <label htmlFor='birthyearInput' style={{ marginRight: 8 }}>born</label>
          <input id='birthyearInput' {...birthyear} />
        </div>
        <button type='submit'>Update Author</button>
      </form>
    </div>
  );
};

export default Authors;
