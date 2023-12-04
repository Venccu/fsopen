import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import axios from 'axios'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)

  const hook = () => {
    console.log('effect')
    personService
      .getAll()
      .then(data => {
        console.log('promise fulfilled')
        setPersons(data)
      })
  }
  
  useEffect(hook, [])

  const addName = (event) => {

    event.preventDefault()
    console.log('Add button clicked', event.target)
    const names = persons.map(p => p.name)

    if (names.includes(newName)) {

      if(newNumber!== '') {

        if(window.confirm(`Do you want to update the number of ${newName} to ${newNumber}?`)) {
          // find id
          const nameid = persons.find(n => n.name === newName).id
          // create new data
          const newp = { name: newName, number: newNumber }
          personService
          .update(nameid,newp)
          .then(data => {
            setPersons(persons.map(person => person.id !== nameid ? person : data))
            setNewName('')
            setNewNumber('')
            // set notification
            setNotification(`Updated number of ${newName}`)
            setTimeout(() => {setNotification(null)},3000)
          })
          .catch(error => {
            // name does not exist anymore on server
            setError(
              `Information of ${newName} has already been removed from server`
            )
            setTimeout(() => {
              setError(null)
            }, 3000)
            // delete name
            setPersons(persons.filter(n => n.id !== nameid))
          })
          
        }
      } else { alert(`${newName} is already added to phonebook, give new number to update`) }
      
    } else {

      // create new data and add to phonebook
      const newp = { name: newName, number: newNumber }
   
      personService
      .create(newp)
      .then(data => {
        setPersons(persons.concat(data))
        setNewName('')
        setNewNumber('')
        })

        // set notification
        setNotification(`Added ${newName}`)
        setTimeout(() => {setNotification(null)},3000)
      }
    
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
    const inputvalue = event.target.value
    // if filter is empty, show all names
    if(inputvalue === '') setShowAll(true) ; else setShowAll(false)
  }

  const deleteName = (id) => {

    const person = persons.find(n => n.id === id)

    if (window.confirm(`Delete '${person.name}'?`)) {

      personService
      .erase(id)
      .then(response => {
        setPersons(persons.filter(n => n.id !== id))
      })
      .catch(error => {
        // delete name
        setPersons(persons.filter(n => n.id !== id))
      })
      }
      return console.log("delete completed")
  }
  

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type='notification' />
      <Notification message={error} type='error' />

      <Filter newFilter = {newFilter} handleFilterChange = {handleFilterChange} />
          
      <h2>Add a new name</h2>
      
      <PersonForm onSubmit={addName} name = {newName} number = {newNumber} handleNameChange = {handleNameChange} handleNumberChange={handleNumberChange}/>
      
      <h2>Names & Numbers</h2>
        
      <Persons deleteName = {deleteName} persons = {persons} showAll = {showAll} newFilter = {newFilter}/>
       
    </div>
  )
}

export default App