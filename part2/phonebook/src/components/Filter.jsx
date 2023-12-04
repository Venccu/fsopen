const Filter = ({newFilter,handleFilterChange}) => {

    return(
    <>
    filter with name: <input value={newFilter}
    onChange={handleFilterChange}/>
    </>
    )

}


export default Filter