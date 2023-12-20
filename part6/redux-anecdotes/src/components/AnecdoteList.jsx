import { useSelector, useDispatch } from 'react-redux'
import {voteFor} from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
    
  const anecdotes = useSelector(state => {
    if ( state.filter === 'ALL' ) {
      return state.anecdotes
    }
    else {
      return state.anecdotes.filter(an => an.content.includes(state.filter))
    }
  })
  
    const dispatch = useDispatch()
  
  const vote = (id) => {
    console.log('vote', id)
    dispatch(voteFor(id))
  }


  return(
    <>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        )}
    </>
  )
}

export default AnecdoteList