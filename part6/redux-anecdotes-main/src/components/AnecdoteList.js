import { useDispatch, useSelector } from 'react-redux';

import { voteAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteList = () => {
  const filteredAnecdotes = useSelector(({ anecdotes, filter }) => {
    return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()));
  });

  const dispatch = useDispatch();

  return (
    <>
      {filteredAnecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => dispatch(voteAnecdote(anecdote.id))}>vote</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AnecdoteList;
