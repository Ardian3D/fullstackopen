import { useEffect, useState } from 'react'

const descriptions = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Drizzle',
  55: 'Dense drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 80: 'Rain showers',
  81: 'Rain showers', 82: 'Violent showers', 95: 'Thunderstorm',
}

const Weather = ({ country }) => {
  const capital = country.capital?.[0]
  const coords = country.capitalInfo?.latlng
  const latitude = coords?.[0]
  const longitude = coords?.[1]
  const [weather, setWeather] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (latitude == null || longitude == null) return undefined
    const controller = new AbortController()
    setWeather(null)
    setStatus('loading')
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(latitude))
    url.searchParams.set('longitude', String(longitude))
    url.searchParams.set('current', 'temperature_2m,wind_speed_10m,weather_code')

    fetch(url, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Weather HTTP ${response.status}`)
        return response.json()
      })
      .then(data => {
        setWeather(data.current)
        setStatus('loaded')
      })
      .catch(error => {
        if (error.name !== 'AbortError') setStatus('error')
      })

    return () => controller.abort()
  }, [latitude, longitude])

  if (!capital) return null
  if (latitude == null || longitude == null) return <p>Weather data unavailable for this capital.</p>

  return (
    <section aria-label="Weather">
      <h3>Weather in {capital}</h3>
      {status === 'loading' && <p>Loading weather...</p>}
      {status === 'error' && <p>Unable to fetch weather at the moment.</p>}
      {status === 'loaded' && weather && (
        <>
          <p>Temperature: {weather.temperature_2m} °C</p>
          <p>Wind speed: {weather.wind_speed_10m} km/h</p>
          <p>Conditions: {descriptions[weather.weather_code] ?? 'Weather code ' + weather.weather_code}</p>
        </>
      )}
      <small>Weather data: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a></small>
    </section>
  )
}

export default Weather
