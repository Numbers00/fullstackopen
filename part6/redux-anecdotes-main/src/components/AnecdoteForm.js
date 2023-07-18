import { useDispatch } from 'react-redux';

import { createAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const create = e => {
    e.preventDefault();
    const content = e.target.content.value;
    e.target.content.value = '';
    dispatch(createAnecdote(content));
  };

  return (
    <form onSubmit={create}>
      <div><input name='content' /></div>
      <button type='submit'>create</button>
    </form>
  );
};

export default AnecdoteForm;
