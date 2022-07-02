import { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherError = (props) => {
  const { country, weatherError } = props;
  return (
    <>
      <h1>Error {weatherError.cod}</h1>
      <p>Could not get weather for {country.capital}</p>
      <p><i>Error message: {weatherError.message}</i></p>
    </>
  )
}

const CountryWeather = (props) => {
  const { country, weather } =  props;
  return (
    <>
      <h1>Weather in {country.capital}</h1>
      <p>temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </>
  )
}

const CountryInfo = (props) => {
  const { country } = props;
  return (
    <>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <p><b>languages:</b></p>
      <ul>
        {
          country.languages.map(e => {
            return <li key={e}>{e}</li>
          })
        }
      </ul>
      <img 
        src={country.flag} 
        alt={`Flag of ${country.name}`} 
        style={{width: '240px'}}
      />
    </>
  )
}

const CountryDisplay = (props) => {
  const { country, weather, weatherError, error, loading } = props;
  if (loading) {
    return (
      <div>
        <CountryInfo country={country} />
      </div>
    )
  } else if (!loading) {
    if (error) {
      return (
        <div>
          <CountryInfo country={country} />
          <WeatherError country={country} weatherError={weatherError} />
        </div>
      )
    } else if (!error) {
      return (
        <div>
          <CountryInfo country={country} />
          <CountryWeather country={country} weather={weather} />
        </div>
      )
    }
  }
}

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [weather, setWeather] = useState({});
  const [weatherError, setWeatherError] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const OWM_API_KEY = process.env.REACT_APP_OWM_API_KEY;

  const getCountries = () => {
    axios
      .get(`https://restcountries.com/v3.1/all`)
      .then(response => {
        setCountries(response.data.map((e,i) => {
          return {
            id: i,
            name: e.name.common,
            capital: e.capital,
            area: e.area,
            languages: typeof e.languages === 'object' ? Object.values(e.languages) : ['no language listed'],
            flag: e.flags.svg
          }
        }));
      });
  }

  useEffect(getCountries, []);

  const getWeather = async (capital) => {
    console.log(OWM_API_KEY);
    setLoading(true);
    await axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&mode=json&units=metric&appid=${OWM_API_KEY}`)
      .then(response => {
        setWeather(response.data);
        setError(false);
        setLoading(false);
      })
      .catch(error => {
        setWeatherError(error.response.data);
        setError(true);
        setLoading(false);
      });
  }

  const handleSearch = () => {
    setFilteredCountries(countries.filter(e => {
      return e.name.toLowerCase().includes(search.toLowerCase());
    }));
    if (filteredCountries.length === 1) {
      getWeather(filteredCountries[0].capital[0]);
    }
  }

  const handleSearchInput = (event) => {
    setSearch(event.target.value);
    handleSearch();
  }

  const handleShow = (country) => {
    setFilteredCountries([country]);
  }

  return (
    <div>
      <span>find countries</span>&nbsp;
      <input type='text' onChange={handleSearchInput} />
      {filteredCountries.length > 10 ? <p>Too many matches, specify another filter</p>
          : filteredCountries.length === 1 ? 
              <CountryDisplay
                country={filteredCountries[0]}
                weather={weather}
                weatherError={weatherError}
                error={error}
                loading={loading}
              /> : 
                  filteredCountries.map(e => {
                    return (
                      <p key={e.id}>
                        {e.name}&nbsp;<button onClick={() => handleShow(e)}>show</button>
                      </p>
                    )
                  })
      }
    </div>
  )
}

export default App;
