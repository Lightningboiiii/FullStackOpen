import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const Weather = ({country}) => {
    
    const [capitalWeather, setCapitalWeather] = useState(
        {
            weather: [{ icon: null }],
            main: { temp: 0 },
            wind: { speed: 0 }
        }
    )
    const apiKey = import.meta.env.VITE_API_KEY
    const weatherBaseUrl = 'http://api.openweathermap.org/data/2.5/weather'
    let id = capitalWeather.weather[0].icon
    let pictureBaseUrl = `https://openweathermap.org/payload/api/media/file/${id}.png`
    let capital = capitalWeather.name
    let capitalTemperature = capitalWeather.main.temp - 273.15
    let capitalWindSpeed = capitalWeather.wind.speed

    const handleFetch = response => {
        setCapitalWeather(response)
    }

    const fetchDataHook = () => {
        axios
          .get(`${weatherBaseUrl}?q=${country.capital},${country.tld[0].substring(1)}&APPID=${apiKey}`)
          .then(response => 
            handleFetch(response.data)
        )
    }
    
    useEffect(fetchDataHook, [])

    return (
        <div>
            <h2> Weather in {capital} </h2>
            <p>Temperature {capitalTemperature.toFixed(2)} °Celsius</p>
            <img 
                src={pictureBaseUrl} 
                alt={'WeatherIcon'} 
                style={{width:150, height:150}}>
            </img>
            <p>Wind {capitalWindSpeed} m/s</p>
        </div>
    )
}

export default Weather
