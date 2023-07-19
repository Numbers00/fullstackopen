import { useMutation, useQueryClient } from 'react-query';

import { useNotificationDispatch } from '../contexts/NotificationContext';

import { createAnecdote } from '../requests';

const AnecdoteForm = () => {
  const queryClient = useQueryClient();

  const notificationDispatch = useNotificationDispatch();
  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes');
      queryClient.setQueryData('anecdotes', [...anecdotes, newAnecdote]);
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: `You added '${newAnecdote.content}'`});
      setTimeout(() => notificationDispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
    },
    onError: (err) => {
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: `An error occurred while adding anecdote`});
      setTimeout(() => notificationDispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
    }
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';

    const anecdote = {
      content: content,
      id: (100000 * Math.random()).toFixed(0),
      votes: 0
    };
    newAnecdoteMutation.mutate(anecdote);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
