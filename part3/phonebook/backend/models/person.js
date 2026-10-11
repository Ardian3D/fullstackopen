const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// Examples of valid numbers: 09-1234556 and 040-22334455.
const numberPattern = /^\d{2,3}-\d+$/
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    unique: true,
  },
  number: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate: {
      validator: value => numberPattern.test(value) && value.length >= 8,
      message: props => `${props.value} is not a valid phone number`,
    },
  },
})

personSchema.set('toJSON', {
  transform: (_document, result) => {
    result.id = result._id.toString()
    delete result._id
    delete result.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
