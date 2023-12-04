const OnePerson = ({deleteName,person,handleDelete}) => {

    return( 
        <p>
        {person.name} {person.number}
        <button onClick = {() => deleteName(person.id)}> delete</button> 
        </p>
    
    )

} 

export default OnePerson