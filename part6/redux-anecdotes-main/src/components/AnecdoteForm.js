import { useDispatch } from 'react-redux';

import { createAnecdote } from '../slices/anecdote';

const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const create = e => {
    e.preventDefault();
    const content = e.target.content.value;
    e.target.content.value = '';
    dispatch(createAnecdote(content));
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div><input name='content' /></div>
        <button type='submit'>create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
