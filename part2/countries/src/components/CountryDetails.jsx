import Weather from './Weather.jsx'

const CountryDetails = ({ country }) => (
  <section className="country">
    <h2>{country.name.common}</h2>
    <p>Capital: {country.capital?.join(', ') || 'Not available'}</p>
    <p>Area: {country.area?.toLocaleString() ?? 'Not available'} km²</p>
    <h3>Languages</h3>
    <ul>
      {Object.entries(country.languages || {}).map(([code, language]) => (
        <li key={code}>{language}</li>
      ))}
    </ul>
    {country.flags?.svg || country.flags?.png ? (
      <img className="flag" src={country.flags.svg || country.flags.png} alt={country.flags.alt || `Flag of ${country.name.common}`} />
    ) : null}
    <Weather key={country.cca3} country={country} />
  </section>
)

export default CountryDetails
