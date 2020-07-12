require('dotenv').config({ debug: process.env.DEBUG })
const express = require('express')
require('./db/mongoose')
const userRoute = require('./router/user');
const taskRoute = require('./router/task');

const app = express()

app.use(express.json())

app.use(userRoute);
app.use(taskRoute);
// the base route
app.get('/', (req, res) => {
    res.send({
        message: `welcome to the task-manager base route`
    });
});

module.exports = app