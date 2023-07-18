import { useDispatch, useSelector } from 'react-redux';

import { voteAnecdote } from '../slices/anecdote';
import { setNotification } from '../slices/notification';

const AnecdoteList = () => {
  const filteredAnecdotes = useSelector(({ anecdotes, filter }) => {
    return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()));
  });

  const dispatch = useDispatch();
  const vote = anecdote => {
    dispatch(voteAnecdote(anecdote.id));
    dispatch(setNotification(`you voted '${anecdote.content}'`));
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
