import Languages from "./Languages"

const Country = ({country}) => {

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p style={{margin:0}}> Capital {country.capital} </p>
            <p style={{margin:0}}> Area {country.area} </p>
            <Languages languages={country.languages}/>
            <img 
                src={country.flags.png} 
                alt={country.flags.alt} 
                style={{width:350, height:233}}>
            </img>
        </div>
    )
}

export default Country
