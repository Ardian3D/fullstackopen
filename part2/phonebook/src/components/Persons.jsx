const Persons = ({ persons, onDelete }) => (
  <ul className="contacts">
    {persons.map(person => (
      <li key={person.id}>
        <span>{person.name} — {person.number}</span>
        <button type="button" onClick={() => onDelete(person)}>
          Delete
        </button>
      </li>
    ))}
  </ul>
)

export default Persons
