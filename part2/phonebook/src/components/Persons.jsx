import OnePerson from './OnePerson'

const Persons = ({deleteName, persons, showAll, newFilter}) => {

// check if all people are shown, if not, filter according to search field
  const peopleToShow = showAll
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

return (
    <>
    {peopleToShow.map(person =>
    <OnePerson deleteName = {deleteName} key={person.name} person={person}/>
    )}
    </>
    )
}

export default Persons