process.env.NODE_ENV = 'test'

const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
    userOne, userOneId,
    populateDatabase, userTwoId,
    userTwo, taskOne,
    taskTwo, taskThree
} = require('./fixtures/db')

beforeEach(populateDatabase)

test('Should create task for user', async () => {
    const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    const task = await Task.findById(res.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should get a task for a user', async () => {
    const res = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(res.body.length).toEqual(2)
})

test('Should not delete other tasks', async () => {
    const rs = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})
