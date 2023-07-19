import { useMutation, useQuery, useQueryClient } from 'react-query';

import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';

import { useNotificationDispatch } from './contexts/NotificationContext';

import { getAnecdotes, updateAnecdote } from './requests';

const App = () => {
  const notificationDispatch = useNotificationDispatch();
  const votedAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes');
      const updatedAnecdotes = anecdotes.map((a) => a.id === updatedAnecdote.id ? updatedAnecdote : a);
      queryClient.setQueryData('anecdotes', updatedAnecdotes);
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: `You voted '${updatedAnecdote.content}'`});
      setTimeout(() => notificationDispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
    }
  });

  const queryClient = useQueryClient();
  const handleVote = (anecdote) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    votedAnecdoteMutation.mutate(updatedAnecdote);
  };

  const result = useQuery('anecdotes', getAnecdotes);

  if (result.isLoading) {
    return <div>Loading anecdotes...</div>;
  }

  if (result.isError) {
    return <div>Anecdote service not available due to problems in server</div>;
  }

  const anecdotes = result.data;
  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
