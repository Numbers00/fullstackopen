import { useState } from 'react'

const Button = (props) => {
  const {handleClick, text} = props
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const StatisticLine = (props) => {
  const {text, value} = props
  return (
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const {good, neutral, bad} = props
  if (good +  neutral + bad > 0) {
    return (
      <>
        <h1>statistics</h1>
        <table>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={good + neutral + bad} />
          <StatisticLine text="average" value={(good - bad) / (good + neutral + bad)} />
          <StatisticLine text="positive" value={`${100*good / (good + neutral + bad)}%`} />
        </table>
      </>
    )
  } else {
    return (
      <>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClick = statistic => {
    switch (statistic) {
      case 'good':
        setGood(good + 1)
        break
      case 'neutral':
        setNeutral(neutral + 1)
        break
      case 'bad':
        setBad(bad + 1)
    }
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => handleClick('good')} text='good' />&nbsp;
      <Button handleClick={() => handleClick('neutral')} text='neutral' />&nbsp;
      <Button handleClick={() => handleClick('bad')} text='bad' />
      <Statistics 
        good={good}
        neutral={neutral}
        bad={bad}
      />
    </div>
  )
}

export default App
