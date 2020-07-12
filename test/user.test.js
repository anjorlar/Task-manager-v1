process.env.NODE_ENV = 'test'

const request = require('supertest');
const app = require('../src/app');

beforeEach(() => {
    console.log('before each')
})

// afterEach(() => {
//     console.log('after each')
// })

test('should sign up a new user', async () => {
    await request(app)
        .post('/users')
        .send({
            name: "ade bayo",
            email: "anjee@example.com",
            password: "mememepopiopjiughgi"
        })
        // console.log('datatat', data)
        .expect(201)
})