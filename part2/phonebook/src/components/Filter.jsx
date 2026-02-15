const Filter = ({searchTerm, onSearchTermChange}) => {
  return (
    <div>
      filter shown with 
      <input
        value={searchTerm}
        onChange={onSearchTermChange}
      />
    </div>
  )
}

export default Filter
