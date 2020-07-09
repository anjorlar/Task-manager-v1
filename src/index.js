require('dotenv').config({ debug: process.env.DEBUG })
const express = require('express')
require('./db/mongoose')
const userRoute = require('./router/user');
const taskRoute = require('./router/task');

const app = express()
const port = process.env.PORT;

app.use(express.json())

app.use(userRoute);
app.use(taskRoute);
// the base route
app.get('/', (req, res) => {
    res.send({
        message: `welcome to the task-manager base route`
    });
});

app.listen(port, () => {
    console.log(`Server is up on port: ${port}`)
});