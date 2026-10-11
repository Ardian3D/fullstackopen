require('dotenv').config()

const mongoose = require('mongoose')
const Person = require('./models/person')

// Exercise 3.12: node mongo.js <password> [<name> <number>]
const [password, name, number, ...extra] = process.argv.slice(2)

function connectionString() {
  if (process.env.MONGODB_URI_TEMPLATE) {
    if (!password) throw new Error('Password argument is required')
    return process.env.MONGODB_URI_TEMPLATE.replace('{PASSWORD}', encodeURIComponent(password))
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('Set MONGODB_URI_TEMPLATE or MONGODB_URI in the .env file')
  }
  return process.env.MONGODB_URI
}

async function main() {
  if (!password || extra.length || (Boolean(name) !== Boolean(number))) {
    throw new Error('Usage: node mongo.js <password> [<name> <number>]')
  }
  await mongoose.connect(connectionString())
  if (!name) {
    const persons = await Person.find({})
    console.log('phonebook:')
    persons.forEach(person => console.log(`${person.name} ${person.number}`))
    return
  }
  await new Person({ name, number }).save()
  console.log(`added ${name} number ${number} to phonebook`)
}

main()
  .catch(error => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
