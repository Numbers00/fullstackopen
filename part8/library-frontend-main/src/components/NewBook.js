import { useMutation } from '@apollo/client';

import { useState } from 'react';

import { ALL_BOOKS, ADD_BOOK } from '../requests';

const NewBook = (props) => {
  const [createBookReq] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }],
    onError: error => console.log(error.graphQLErrors[0].message),
  });

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState(2000);
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  if (!props.show)
    return null;

  const addBook = async (event) => {
    event.preventDefault();

    createBookReq({ variables: { title, author, published, genres } });

    setTitle('');
    setPublished(2000);
    setAuthor('');
    setGenres([]);
    setGenre('');
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  return (
    <div>
      <form onSubmit={addBook}>
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(parseInt(target.value))}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
            style={{ marginRight: 8 }}
          />
          <button onClick={addGenre} type='button'>
            add genre
          </button>
        </div>
        <div style={{ marginBottom: 12 }}>genres: {genres.join(' ')}</div>
        <button type='submit'>create book</button>
      </form>
    </div>
  );
};

export default NewBook;
