import { useMutation, useQueryClient } from 'react-query';

import { createAnecdote } from '../requests';

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes');
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    if (content.length < 5) return;
    
    event.target.anecdote.value = '';

    const anecdote = {
      content: content,
      id: (100000 * Math.random()).toFixed(0),
      votes: 0
    };
    newAnecdoteMutation.mutate(anecdote);
  }

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
