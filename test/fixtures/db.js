const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Anjy Ade',
    email: 'anjy@example.com',
    password: 'poiuytrewqasdf',
    tokens: [{
        token: jwt.sign({
            _id: userOneId
        }, process.env.JWT_SECRETKEY)
    }]
}

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Anjee Ola',
    email: 'anjeee@example.com',
    password: 'asdfghjklmnbvcxz',
    tokens: [{
        token: jwt.sign({
            _id: userTwoId
        }, process.env.JWT_SECRETKEY)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: true,
    owner: userTwo._id
}

const populateDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    // await User.insertMany(userOne)
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOne, userOneId,
    populateDatabase, userTwoId,
    userTwo, taskOne, taskTwo, taskThree
}