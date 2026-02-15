const Person = ({name, number, onPersonChange, id}) => {
  return (
    <div>
      <p style={{margin:0}}> {name} {number}
        <button onClick={() => onPersonChange(id)}>delete</button>
      </p>
    </div>
  )
}

export default Person
