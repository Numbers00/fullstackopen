import { useDispatch } from 'react-redux';

import anecdoteService from '../services/anecdotes';

import { createAnecdote } from '../slices/anecdotes';
import { setNotification, removeNotification} from '../slices/notification';

const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const create = e => {
    e.preventDefault();
    const content = e.target.content.value;
    e.target.content.value = '';
    dispatch(createAnecdote(content));
    dispatch(setNotification(`you created '${content}'`));
    setTimeout(() => dispatch(removeNotification()), 5000);
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
