const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the word "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

//sets up virtual relationship with task
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// hides private data
// accesses the userSchema.statics.findByCredentials function and it is a method on the instance of the 'user'
// THE toJSON(it must be exactly that toJSON) method deletes data he do not want to be sent as a response as we stated here
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject()   //toObject method is provided by mongoose

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

// generates auth token
// accesses the userSchema.statics.findByCredentials function and it is a method on the instance of the 'user'
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRETKEY);

    user.tokens = user.tokens.concat({ token });
    await user.save()
    return token;

}

// to be accessed by 'findByCredentials' and it is a method on the 'User' it creates an instatnce of that 'User' which is accessable using (methods) via 'user
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email })

    if (!user) {
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to Login')
    }

    return user
}

// program to hash the plain text password before saving
// pre before saving and post after saving we using pre before we need it before is saves in the db
//used function instead of arrow function in order to access the this binding as arrow function does not bind this
userSchema.pre('save', async function (next) {
    const user = this; // this equals the document been saved
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next() // we call next to exit the function ie saving the user if next isn't called it will assume the function is still running hence the function will not exit hence not saving the user
})

//Deletes user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id })
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User