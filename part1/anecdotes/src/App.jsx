import { useState } from 'react'

// Original example sayings for this practice app. You can replace them with
// the anecdotes given in the course material if you prefer.
const anecdotes = [
  'Readable code is a gift to your future self.',
  'A small commit is easier to understand than a heroic rewrite.',
  'When a build fails, start with the first error.',
  'A code review should be a conversation, not a verdict.',
  'Good logging turns a mystery into a checklist.',
  'A simple design is easier to extend than a clever maze.',
  'Ship small improvements and learn from the result.',
  'Tests are notes you leave for the next developer.',
]

const Anecdote = ({ text, votes }) => (
  <div>
    <p>{text}</p>
    <p>has {votes} votes</p>
  </div>
)

const App = () => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const vote = () => {
    setVotes(previous => {
      const next = [...previous]
      next[selected] += 1
      return next
    })
  }

  const nextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const mostVotes = Math.max(...votes)
  const mostVotedIndex = votes.indexOf(mostVotes)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote text={anecdotes[selected]} votes={votes[selected]} />
      <button onClick={vote}>vote</button>{' '}
      <button onClick={nextAnecdote}>next anecdote</button>

      <h1>Anecdote with most votes</h1>
      <Anecdote text={anecdotes[mostVotedIndex]} votes={votes[mostVotedIndex]} />
    </div>
  )
}

export default App
