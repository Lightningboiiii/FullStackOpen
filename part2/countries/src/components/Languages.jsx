const Languages = ({languages}) => {
    
    return (
        <div>
          <h2>Languages</h2>
          <ul>
            {Object
              .keys(languages)
              .map(key => (
                <li key={key}>
                  {languages[key]}
                </li>
              ))
            }
          </ul>
        </div>
    )
}

export default Languages
