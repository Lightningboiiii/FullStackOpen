import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notifications'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearchTerm, setNewSearchTerm] = useState('')
  const [newMessage, setNewMessage] = useState(null)

  const fetchDataHook = () => {
      personService
    .getAll()
    .then(initialPersons =>
      setPersons(initialPersons)
    ).catch(error => 
        handleFetch([`Could not load Phonebook`, false])
      )
  }

  const handleFetch = message => {
    setNewMessage(message)
      setTimeout(() => {
        setNewMessage(null)
      }, 2000)
  }

  const handleNameChange = e => {
    setNewName(e.target.value)
  }

  const handleNumberChange = e => {
    setNewNumber(e.target.value)
  }

  const handleSearchChange = e => {
    setNewSearchTerm(e.target.value)
  }

  const handleDeletePerson = id => {

    const removePerson = persons.find(p => p.id === id)
    
    if(window.confirm(`Delete ${removePerson.name}`)){
    personService
      .remove(id)
      .then(returnedPerson => {
        setPersons(persons
        .filter(p => p.id !== id))
        handleFetch([`${returnedPerson.name} deleted`, true])
      })
      .catch(error => {
        setPersons(persons.filter(p =>
          p.id !== removePerson.id
        ))
        handleFetch([`Information of ${removePerson.name} has already been removed from server`, false])
      })
    }
  }

  const addPerson = e => {
    e.preventDefault()
    const personObject = { 
        name: newName,
        number: newNumber
      }

    const updatePerson = persons.find(p => (p.name === newName))

    if(persons.some(p => (p.name === newName))){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      personService
        .update(updatePerson.id, personObject)
        .then(returnedPerson => {
            setPersons(persons.map(p => 
              p.id === returnedPerson.id
              ? returnedPerson
              : p
            ))
            handleFetch([`${returnedPerson.name} updated`, true])
          }
        ).catch(error => {
          setPersons(persons.filter(p =>
            p.id !== updatePerson.id
          ))
          handleFetch([`Information of ${updatePerson.name} has already been removed from server`, false])
          }
        )
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          handleFetch([`Added ${returnedPerson.name}`, true])
        })
        .catch(error => {
          handleFetch([`Could not add ${personObject.name}`, false])
        })
    }
    setNewName('')
    setNewNumber('')
  }

  useEffect(fetchDataHook, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={newMessage}/>
      <Filter
        searchTerm={newSearchTerm}
        onSearchTermChange={handleSearchChange}
      />
      <h2>Add a new</h2>
      <PersonForm 
        onPersonChange={addPerson} 
        name={newName}
        onNameChange={handleNameChange}
        number={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>      
      <Persons 
        persons={persons}
        searchTerm={newSearchTerm}
        onPersonChange={handleDeletePerson}
      />
    </div>
  )
}

export default App
