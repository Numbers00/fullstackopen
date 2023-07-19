import { useDispatch, useSelector } from 'react-redux';

import { voteAnecdote } from '../slices/anecdotes';
import { setNotification, removeNotification } from '../slices/notification';

const AnecdoteList = () => {
  const filteredAnecdotes = useSelector(({ anecdotes, filter }) => {
    return anecdotes.filter(a => a.content?.toLowerCase().includes(filter.toLowerCase()));
  });

  const dispatch = useDispatch();
  const vote = anecdote => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    dispatch(voteAnecdote(anecdote.id, updatedAnecdote));
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5));
  };

  return (
    <>
      {filteredAnecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AnecdoteList;
