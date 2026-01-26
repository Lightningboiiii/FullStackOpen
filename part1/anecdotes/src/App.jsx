import { useState } from 'react'

const Display = ({text}) => <div><h1>{text}</h1></div>

const Anecdotes = ({anecdotes, selected, votes}) => <p>{anecdotes[selected]} <br></br> has {votes[selected]} vote(s)</p>

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  let arr = new Uint8Array(anecdotes.length)
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(arr)
  
  const handleNextAnecdote = () => {
    setSelected(Math.floor(Math.random()*votes.length))
    }

  const handleVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const getMaxValue = (array) => {
    let maxValue = 0
    for(let i = 0; i<array.length; i++) {
      if(array[i] > maxValue){
        maxValue = array[i]
      }
    }
    return maxValue
  }

  const getIndexOf = (array, value) => {
    let index = 0
    for(let i = 0; i<array.length; i++) {
      if(array[i]===value){
        index = i
      }
    }
    return index
  }

  return (
    <div>
      <Display text="Anecdote of the day"/>
      <Anecdotes anecdotes={anecdotes} selected={selected} votes={votes}/>
      <Button onClick={handleVote} text="vote"/>
      <Button onClick={handleNextAnecdote} text="next anecdote"/>
      <Display text="Anecdote with most votes"/>
      <Anecdotes anecdotes={anecdotes} selected={getIndexOf(votes, getMaxValue(votes))} votes={votes}/>
    </div>
  )
}

export default App