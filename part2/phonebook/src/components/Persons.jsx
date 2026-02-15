import Person from './Person'

const Persons = ({persons, searchTerm, onPersonChange}) => {
  const personsToShow = searchTerm === '' || !searchTerm
    ? persons
    : persons.filter(p => 
        p.name.toLowerCase()
              .includes(searchTerm
              .toLowerCase())
      )

  return (
    <div>
      {personsToShow.map(p =>
        <Person 
          key={p.id} 
          name={p.name} 
          number={p.number}
          onPersonChange={onPersonChange}
          id={p.id}
        />
      )}
    </div>
  )
}

export default Persons
