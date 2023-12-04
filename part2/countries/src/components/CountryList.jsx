const CountryList = ({countries,setCountries}) => {

    if(countries.length > 0 ) {
        if(countries.length > 10) {

            return <>Too many matches, specify another filter</>

        } else { 
            
            if(countries.length === 1) {
                
                // return specific information on one country
                return(
                    <>
                        <h1>{countries[0].name.common}</h1>
                        <p>capital {countries[0].capital}<br />
                        area {countries[0].area}</p>

                        <h4>languages</h4>
                        <ul>
                        {(Object.values(countries[0].languages)).map(l => {
                        <li key = {l}> {l}</li> 
                        } 
                        )}

                        </ul>

                        <img src={countries[0].flags.png} alt={countries[0].flags.alt}></img>
                    </>     
                )

            } else
                // return list of countrynames
                return (
                    <>
                        {countries.map(c => <p key = {c.name.common}>{c.name.common} <button onClick={() => setCountries([c])}> show </button></p> )}
                    </>
                )
        }
    }
}

export default CountryList 