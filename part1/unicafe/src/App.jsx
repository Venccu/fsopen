import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
const StatisticLine = ({text, score}) => {
  return (
    <>
    <tr>
      <td>{text}</td> 
      <td>{score}</td>
    </tr> 
    </>
  )
}

const Statistics = ({good, neutral, bad}) => {

  const totalVotes = () => {
    return good+bad+neutral
  }

  const valueVotes = () => {
    return good-bad
  }
  if(totalVotes() == 0) {
    return(
      <>No feedback given</>
    )
  } else {
  return(
    <> 
    <table>
    <tbody>
      <StatisticLine text = "good" score={good}/>
      <StatisticLine text = "neutral" score={neutral}/>
      <StatisticLine text = "bad" score={bad}/>
      <StatisticLine text = "all" score={totalVotes()}/>
      <StatisticLine text = "average" score={valueVotes()/totalVotes()}/>
      <StatisticLine text = "positive" score={good/totalVotes()*100+" %"}/>
      </tbody>
    </table>
    </>
  )
  }
}



const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    console.log('clicked good')
    setGood(good+1)
  }

  const handleNeutral = () => {
    console.log('clicked neutral')
    setNeutral(neutral+1)
  }

  const handleBad = () => {
    console.log('clicked bad')
    setBad(bad+1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGood} text="Good"/>
      <Button handleClick={handleNeutral} text="Neutral"/>
      <Button handleClick={handleBad} text="Bad"/>
      <h1>statistics</h1>
      <Statistics good = {good} neutral = {neutral} bad = {bad}/>
    </div>
  )
}

export default App