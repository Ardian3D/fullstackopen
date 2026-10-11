import { useEffect, useState } from 'react'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Persons from './components/Persons.jsx'
import Notification from './components/Notification.jsx'
import personService from './services/persons.js'

const messageFromError = (error, fallback) => {
  return error.response?.data?.error || fallback
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let active = true
    personService.getAll()
      .then(initialPersons => {
        if (active) setPersons(initialPersons)
      })
      .catch(() => {
        if (active) setNotice({ type: 'error', message: 'Cannot load phonebook. Check that the Express backend and MongoDB are running.' })
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(null), 5000)
    return () => clearTimeout(timer)
  }, [notice])

  const addPerson = async event => {
    event.preventDefault()
    const name = newName.trim()
    const number = newNumber.trim()
    if (!name || !number) return

    const existing = persons.find(person => person.name.toLowerCase() === name.toLowerCase())

    if (existing) {
      if (existing.number === number) {
        window.alert(`${existing.name} is already added to phonebook`)
        return
      }
      if (!window.confirm(`${existing.name} is already added. Replace the old number with a new one?`)) return

      try {
        const updated = await personService.update(existing.id, { ...existing, number })
        setPersons(previous => previous.map(person => person.id === existing.id ? updated : person))
        setNotice({ type: 'success', message: `Updated ${existing.name}'s number` })
        setNewName('')
        setNewNumber('')
      } catch (error) {
        if (error.response?.status === 404) {
          setPersons(previous => previous.filter(person => person.id !== existing.id))
          setNotice({ type: 'error', message: `Information for ${existing.name} has already been removed from server` })
        } else {
          setNotice({ type: 'error', message: messageFromError(error, `Failed to update ${existing.name}`) })
        }
      }
      return
    }

    try {
      const created = await personService.create({ name, number })
      setPersons(previous => previous.concat(created))
      setNotice({ type: 'success', message: `Added ${name}` })
      setNewName('')
      setNewNumber('')
    } catch (error) {
      setNotice({ type: 'error', message: messageFromError(error, `Failed to add ${name}`) })
    }
  }

  const deletePerson = async person => {
    if (!window.confirm(`Delete ${person.name}?`)) return
    try {
      await personService.remove(person.id)
      setPersons(previous => previous.filter(item => item.id !== person.id))
      setNotice({ type: 'success', message: `Deleted ${person.name}` })
    } catch (error) {
      if (error.response?.status === 404) {
        setPersons(previous => previous.filter(item => item.id !== person.id))
        setNotice({ type: 'error', message: `${person.name} had already been removed` })
      } else {
        setNotice({ type: 'error', message: messageFromError(error, `Failed to delete ${person.name}`) })
      }
    }
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.trim().toLowerCase())
  )

  return (
    <main>
      <h1>Phonebook</h1>
      <Notification notice={notice} />
      <Filter value={filter} onChange={event => setFilter(event.target.value)} />
      <h2>Add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={event => setNewName(event.target.value)}
        newNumber={newNumber}
        onNumberChange={event => setNewNumber(event.target.value)}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} onDelete={deletePerson} />
    </main>
  )
}

export default App
