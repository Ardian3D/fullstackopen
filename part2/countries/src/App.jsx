import { useEffect, useState } from 'react'
import CountryDetails from './components/CountryDetails.jsx'

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [selectedCode, setSelectedCode] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const controller = new AbortController()
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Countries HTTP ${response.status}`)
        return response.json()
      })
      .then(data => {
        setCountries(data)
        setStatus('loaded')
      })
      .catch(error => {
        if (error.name !== 'AbortError') setStatus('error')
      })
    return () => controller.abort()
  }, [])

  const normalized = query.trim().toLowerCase()
  const matchingCountries = normalized
    ? countries.filter(country => country.name.common.toLowerCase().includes(normalized))
    : []
  const selected = matchingCountries.find(country => country.cca3 === selectedCode)
  const chosenCountry = selected || (matchingCountries.length === 1 ? matchingCountries[0] : null)

  const onQueryChange = event => {
    setQuery(event.target.value)
    setSelectedCode(null)
  }

  return (
    <main>
      <h1>Countries</h1>
      <label>
        Find countries{' '}
        <input value={query} onChange={onQueryChange} placeholder="Type a country name" />
      </label>

      {status === 'loading' && <p>Loading country information...</p>}
      {status === 'error' && <p>Could not load countries. Check your network and retry the page.</p>}

      {status === 'loaded' && !normalized && <p>Enter a country to search.</p>}
      {status === 'loaded' && normalized && matchingCountries.length === 0 && <p>No matching countries.</p>}
      {status === 'loaded' && matchingCountries.length > 10 && <p>Too many matches, specify another filter.</p>}
      {status === 'loaded' && matchingCountries.length <= 10 && chosenCountry && (
        <CountryDetails key={chosenCountry.cca3} country={chosenCountry} />
      )}
      {status === 'loaded' && matchingCountries.length > 1 && matchingCountries.length <= 10 && !chosenCountry && (
        <ul className="matches">
          {matchingCountries.map(country => (
            <li key={country.cca3}>
              {country.name.common}{' '}
              <button type="button" onClick={() => setSelectedCode(country.cca3)}>show</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
