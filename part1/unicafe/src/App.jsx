import { useState } from 'react'

const Display = ({text}) => <div><h1>{text}</h1></div>

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Statistics = ({good, neutral, bad}) => {
  if(good===0 && neutral===0 && bad===0){
    return <p>No feedback given</p>
  }
  return (
    <div>
      <table>
        <tbody>
          <StatisticsLine text="good" value={good}/>
          <StatisticsLine text="neutral" value={neutral}/>
          <StatisticsLine text="bad" value={bad}/>
          <StatisticsLine text="all" value={good+neutral+bad}/>
          <StatisticsLine text="average" value={(good+neutral*0+bad*(-1))/(good+neutral+bad)}/>
          <StatisticsLine text="positives" value={good/(good+neutral+bad)*100+" %"}/>
        </tbody>
      </table>
    </div>
  )
}

const StatisticsLine = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodReview = () => {
    setGood(good+1)
  }

  const handleNeutralReview = () => {
    setNeutral(neutral+1)
  }

  const handleBadReview = () => {
    setBad(bad+1)
  }

  return (
    <div>
      <Display text="give feedback"/>
      <Button onClick={handleGoodReview} text="good"/>
      <Button onClick={handleNeutralReview} text="neutral"/>
      <Button onClick={handleBadReview} text="bad"/>
      <Display text="statistics"/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
