import { useState, useEffect } from 'react'
import axios from 'axios'
import Searchbar from './components/Searchbar'
import Display from './components/Display'

function App() {
  const [newSearchTerm, setNewSearchTerm] = useState('')
  const [countries, setCountries] = useState([])
  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

  const handleSearchChange = e => {
    setNewSearchTerm(e.target.value)
  }

  const handleClick = country => {
    setNewSearchTerm(country)
  }

  const handleFetch = response => {
    setCountries(response)
  }

  const fetchDataHook = () => {
    axios
      .get(baseUrl)
      .then(response => 
        handleFetch(response.data)
      )
  }

  useEffect(fetchDataHook,[])

  const filteredNames = newSearchTerm === '' || !newSearchTerm
    ? !countries
    : countries
      .map(c =>
        c.name.common
      )
      .filter(n => 
        n
          .toLowerCase()
          .includes(
            newSearchTerm.toLowerCase()
          )
      )

return (
    <div>
      <Searchbar 
        searchTerm={newSearchTerm} 
        onSearchTermChange={handleSearchChange}
      />
      <Display
        filteredNames={filteredNames}
        countries={countries}
        onHandleClick={handleClick}
      />
    </div>
  )
}

export default App
