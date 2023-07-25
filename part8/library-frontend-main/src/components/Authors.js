import { useMutation, useQuery } from '@apollo/client';

import { useField } from '../hooks';

import { ALL_AUTHORS, UPDATE_BIRTHYEAR } from '../requests';


const Authors = (props) => {
  const authorsRes = useQuery(ALL_AUTHORS);
  const authors = authorsRes.data?.allAuthors;

  const [updateBirthyearReq] = useMutation(UPDATE_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  });

  const { reset: resetName, ...name } = useField('text');
  const { reset: resetBirthyear, ...birthyear } = useField('number', 2000);
  const changeBirthyear = e => {
    e.preventDefault();
    if (!name.value || !birthyear.value) return;

    console.log(name.value)
    updateBirthyearReq({ variables: { name: name.value, setBornTo: parseInt(birthyear.value) } });
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
          {authors && authors.map((a) => (
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
          <select id='nameSelect' onChange={name.onChange}>
            <option value=''>Select author</option>
            {authors && authors.map((a, i) => (
              <option key={i} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', marginBottom: 12 }}>
          <label htmlFor='birthyearInput' style={{ marginRight: 8 }}>born</label>
          <input id='birthyearInput' {...birthyear} />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  );
};

export default Authors;
