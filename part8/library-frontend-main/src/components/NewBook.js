import { useMutation } from '@apollo/client';

import { useState } from 'react';

import { updateCache } from '../helpers';

import { ALL_BOOKS, FILTERED_BOOKS, ADD_BOOK } from '../requests';


const NewBook = (props) => {
  const [createBookReq] = useMutation(ADD_BOOK, {
    // refetchQueries: [{ query: ALL_BOOKS }, { query: FILTERED_BOOKS }],
    onError: error => {
      if (error.graphQLErrors)
        error.graphQLErrors.forEach(({ message }) => console.log(message));
      else
        console.log(error.message || error);
    },
    update: (cache, res) => {
      const addedBook = res.data.addBook;
      console.log('addedBook', addedBook);

      updateCache(cache, { query: ALL_BOOKS }, 'allBooks', addedBook);
      addedBook.genres.forEach(g => {
        const filteredBooksData = cache.readQuery({
          query: FILTERED_BOOKS,
          variables: { genre: g },
        });
        console.log('filteredBooksData', filteredBooksData);
        if (filteredBooksData) 
          updateCache(cache, { query: FILTERED_BOOKS, variables: { genre: g } }, 'allBooks', addedBook);
      });
    }
    // update: (cache, res) => {
    //   const addedBook = res.data.addBook;
    //   console.log('addedBook', addedBook);
    //   console.log('cache', cache);

    //   cache.updateQuery({ query: ALL_BOOKS }, (data) => {
    //     console.log('data', data);
    //     const { allBooks } = data;
    //     return {
    //       allBooks: allBooks.concat(addedBook)
    //     }
    //   });

    //   cache.updateQuery({ query: FILTERED_BOOKS }, (data) => {
    //     console.log('data2', data);
    //     const { allBooks: filteredBooks } = data;
    //     const genreFilter = [...new Set(filteredBooks.map(b => b.genres).flat())];
    //     if (genreFilter.length > 1) return { allBooks: filteredBooks.concat(addedBook) };
    //     else if (addedBook.genres.includes(genreFilter[0])) return { allBooks: filteredBooks.concat(addedBook) };
    //     else return { filteredBooks };
    //   });
    // }
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
