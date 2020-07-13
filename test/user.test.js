process.env.NODE_ENV = 'test'

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user')
const { userOne, userOneId, populateDatabase } = require('./fixtures/db')

beforeEach(populateDatabase)

// afterEach(() => {
//     console.log('after each')
// })

test('should sign up a new user', async () => {
    const res = await request(app)
        .post('/users')
        .send({
            name: "ade bayo",
            email: "anjee@example.com",
            password: "mememepopiopjiughgi"
        })
        // console.log('datatat', data)
        .expect(201)
    // Assert that the database was changed correctly
    const user = await User.findById(res.body.user._id)
    expect(user).not.toBeNull()

    // Assertion about the response
    expect(res.body).toMatchObject({
        user: {
            name: "ade bayo",
            email: "anjee@example.com",
        },
        token: user.tokens[0].token
    })
    // tests that the password was hashed
    expect(user.password).not.toBe('mememepopiopjiughgi')
})

test('should login existing user', async () => {
    const res = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)
    const user = await User.findById(userOneId)
    expect(res.body.token).toBe(user.tokens[1].token)
    //done() // done()  is passed into the arrow function and it can be called instead of using async await
})

test('should not login non existing user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'hihihi'
        }).expect(500)
})

test('Should get profile for users', async () => {
    const res = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) // sets the autorization for the authentication headed to the user token
        .send()
        .expect(200)
})

test('should not get profile for unauthenticated users', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should not delete account for an unauthorized user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload Avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/profile-pic.jpg') // we put the image in the fixtures folder and import from there
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Bayu'
        }).expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Bayu')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Lagos'
        }).expect(400)
})
