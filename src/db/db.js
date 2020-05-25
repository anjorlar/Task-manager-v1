const mongoose = require('mongoose');
const validator = require('validator');
// mongoose.Promise = global.Promise

mongoose.connect("mongodb://localhost:27017/task-manager", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then((res) => {
    console.log('connected to database successfully')
}).catch((err) => {
    console.log('error connecting to database', err.message)
    process.exit(1)
})


const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error(`${value} is not accepted as password please input another password`)
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        },
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error(`${value} cannot be negative`)
            }
        }
    }
})

const Task = mongoose.model('task', {
    description: {
        type: String
    },
    completed: {
        type: Boolean
    }
})


const me = new User({
    name: "    Anjy    ",
    email: '   PHAMO@me.com',
    password: ' ppssword'
})

const todo = new Task({
    description: "lorem ipd the audb",
    completed: false
})

me.save().then(() => {
    console.log(me)
}).catch((error) => {
    console.log('error', error)
})

// todo.save().then((res) => {
//     console.log(res)
// }).catch((err) => {
//     console.error(err)
// })