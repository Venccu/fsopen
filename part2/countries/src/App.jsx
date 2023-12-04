import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'

const App = () => {
 
  const [newFilter, setNewFilter] = useState('')
 
  const [countries, setCountries] = useState({})
  


  useEffect(() => {
    
    // skip is nothing is put in filter
    if(newFilter) {
      console.log('finding matching countries...')
      axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
     
        setCountries(response.data.filter(n => n.name.common.toLowerCase().includes(newFilter.toLowerCase())))
      })
      }
  
  }, [newFilter])

  const handleChange = (event) => {
    setNewFilter(event.target.value)
    const inputvalue = event.target.value
    // if filter is empty
    if(inputvalue === '') setCountries({})
  }

  
  return (
    <div>
      <p>find countries: <input value={newFilter} onChange={handleChange} /> </p>
        
      <CountryList countries = {countries} setCountries={setCountries}/>

    </div>
  )
}

export default App