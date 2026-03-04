const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('Connecting to', url)
mongoose.connect(url, {family: 4})
    .then(response => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB', error.message)
    })

const validators = [
    {
        validator: nameValidator = name => /^[a-zA-z]+ [a-zA-z]+$/.test(name),
        message: props => `${props.value} is not a valid name, please use only alphabet characters and format firstname lastname`
    },
    {
        validator: numberValidator = number => /(\d{2}|\d{3})-(\d{7}|d\{8})/.test(number),
        message: props => `${props.value} is not a valid phone number, please use only numbers and format xx(x)-xxxxxxx(x)`
    }
]

const personSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Username required'],
        minLength: 3,
        validate: {
            validator: validators[0].validator,
            message: validators[0].message
        }
    },
    number: {
        type: String,
        required: [true, 'Usernumber required'],
        minLength: 8,
        validate: {
            validator: validators[1].validator,
            message: validators[1].message
        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
