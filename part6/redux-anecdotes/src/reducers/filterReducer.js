

export const filterChange = (input) => {
  if (input==='') {
    return {
      type: 'FILTER_OFF'
  }
  }
  return {
    type: 'FILTER_ON',
    payload: input
  }
}

const filterReducer = (state = 'ALL', action) => {
    console.log('state now: ', state)
    console.log('action', action)
    switch (action.type) {
      case 'FILTER_ON': {
        return action.payload
      }
      case 'FILTER_OFF': return 'ALL'
      default: return state
    }
  }
  
  export default filterReducer