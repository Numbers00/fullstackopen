import { useState } from 'react'

const AnecdotesSection = props => {
  const {anecdote, points} = props
  return (
    <>
      <h1>Anecdote of the day</h1>
      <p>{anecdote}</p>
      <p>has {points} votes</p>
    </>
  )
}

const MostVotedAnecdote = props => {
  const {anecdote, points} = props
  return (
    <>
      <h1>Anecdote with most votes</h1>
      <p>{anecdote}</p>
      <p>has {points} votes</p>
    </>
  )
}

const Button = props => {
  const {handleClick, text} = props
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState([...Array(7).fill(0)])

  const handleClick = str => () => {
    switch (str) {
      case 'vote':
        const copy = [...points]
        copy[selected] += 1
        setPoints(copy)
        break
      case 'nextAnecdote':
        setSelected(Math.floor(Math.random()*7))
        break
      default:
        // do nothing
    }
  }

  return (
    <div>
      <AnecdotesSection
        anecdote={anecdotes[selected]}
        points={points[selected]}
      />
      <Button handleClick={handleClick('vote')} text='vote' />&nbsp;
      <Button handleClick={handleClick('nextAnecdote')} text='next anecdote' />
      <MostVotedAnecdote
        anecdote={anecdotes[points.indexOf(Math.max(...points))]}
        points={Math.max(...points)}
      />
    </div>
  )
}

export default App
