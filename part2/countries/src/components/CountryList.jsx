const CountryList = ({countries, onHandleClick}) => {

    return (
        <div>
        {
          countries.map(n => 
            <p key={n} style={{margin:0}}>
              {n}
              <button onClick={() => onHandleClick(n)}>show</button>
            </p>
          )
        }
        </div>
    )
}

export default CountryList
