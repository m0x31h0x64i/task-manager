const request = require('supertest')
const app = require('../app')
const { setupDatabase, userOne, userOneId } = require('./fixtures/database')
const users = require('../models/users')

beforeEach(setupDatabase)

test('Should signup new user.', async() => {
    await request(app)
        .post('/users')
        .send({
            name: 'signup',
            email: 'signup@example.com',
            password: 'signup123'
        }).expect(201)
})

test('Should login existing user.', async() => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await users.findById(userOneId)
    expect(response.body.token).toEqual(user.tokens[1].token)
})

test('Should not login nonexistent user.', async() => {
    await request(app).post('/users/login').send({
        email: 'wrong email',
        password: 'wrong password'
    }).expect(500)
})

test('Should get profile for user.', async() => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user.', async() => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user.', async() => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        const user = await users.findById(userOneId)
        expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user.', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image.', async() => {
        await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', './tests/fixtures/pic.jpg')
    .expect(200)
    const user = await users.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fileds.', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'updated',
            email: 'updated@example.com',
            password: 'updated123'
        }).expect(200)
    const user = await users.findById(userOneId)
    expect(user.name).toEqual('updated')
})

test('Should not update invalid user fileds.', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'updated',
            email: 'updated@example.com',
            password: 'updated123',
            location: 'USA'
        }).expect(400)
})

test('Should not signup user with invalid name/email/password.', async() => {
    await request(app)
        .post('/users')
        .send({
            name: '',
            email: 'example',
            password: '123'
        }).expect(500)
    const user = await users.findOne({ name: 1 })
    expect(user).toBeNull()
})

test('Should not update user if unauthenticated.', async() => {
    await request(app)
        .patch('/users/me')
        .send({
            name: userOne.name,
            email: userOne.email,
            password: 'new123456'
        }).expect(401)
})

test('Should not update user with invalid name.', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: ''
        }).expect(500)
    expect(userOne.name).not.toEqual(1)
})

test('Should not update user with invalid email.', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: 'newemail'
        }).expect(500)
    expect(userOne.email).not.toEqual('newemail')
})

test('Should not update user with invalid password.', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: '123'
        }).expect(500)
})

test('Should not delete user if unauthenticated.', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})