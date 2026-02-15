import Weather from "./Weather"
import Country from "./Country"
import CountryList from "./CountryList"

const Display = ({filteredNames, countries, onHandleClick}) => {  

  let country = countries.find(c => c.name.common === filteredNames[0] && filteredNames.length === 1) 
  if(!filteredNames){ 
    
    return (
      <p>Please enter a search term.</p>
    )
  } else if(filteredNames.length > 10){ 
    
    return (
      <p>Too many matches, specify another filter.</p>
    )
  } else if(filteredNames.length > 1) { 
    
    return (
      <CountryList 
        countries={filteredNames}
        onHandleClick={onHandleClick}  
      />  
    )
  } else if(country){ 
    
    return (
      <div>
        <Country country={country}/>
        <Weather country={country}/>
      </div>
    ) 
  } else {

    return (
      <p>0 hits found. Please try again.</p>
    )
  }
}

export default Display
