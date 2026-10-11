const test = require('node:test')
const assert = require('node:assert/strict')
const Person = require('../models/person')

test('accepts a valid name and phone number', () => {
  const person = new Person({ name: 'Example User', number: '040-12345678' })
  assert.equal(person.validateSync(), undefined)
})

test('rejects name shorter than three characters', () => {
  const person = new Person({ name: 'Al', number: '040-12345678' })
  assert.ok(person.validateSync())
})

test('rejects phone without proper two or three-digit area code', () => {
  const person = new Person({ name: 'Example User', number: '1-12345678' })
  assert.ok(person.validateSync())
})

test('rejects phone containing multiple hyphens', () => {
  const person = new Person({ name: 'Example User', number: '10-22-334455' })
  assert.ok(person.validateSync())
})

test('rejects number shorter than eight characters', () => {
  const person = new Person({ name: 'Example User', number: '09-1234' })
  assert.ok(person.validateSync())
})
