const request = require('supertest')
const app = require('../app')
const { setupDatabase,
     userOne,
      userOneId,
       userTwo,
        userTwoId,
         taskOne, 
          taskTwo, 
           taskThree 
            } = require('./fixtures/database')
const tasks = require('../models/tasks')

beforeEach(setupDatabase)

test('Should create a task for user.', async() => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'new task'
        }).expect(201)
    const task = await tasks.findById(response.body._id)
    expect(task).not.toBeNull()
})

test('Should show all user tasks.', async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should not delete other users tasks.', async() => {
    await request(app)
        .delete('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    expect(taskOne).not.toBeNull()
})

test('Should not create task with invalid description.', async() => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: ''
        }).expect(400)
})

test('Should not create task with invalid completed.', async() => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: ''
        }).expect(400)
})

test('Should not update task with invalid description.', async() => {
    await request(app)
        .patch('/tasks' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: ''
        }).expect(404)
})

test('Should not update task with invalid completed.', async() => {
    await request(app)
        .patch('/tasks' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: ''
        }).expect(404)
})