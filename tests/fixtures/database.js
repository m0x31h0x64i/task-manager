const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const users = require('../../models/users')
const tasks = require('../../models/tasks')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'loginOne',
    email: 'loginOne@example.com',
    password: 'loginOne123',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'loginTwo',
    email: 'loginTwo@example.com',
    password: 'loginTwo123',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: mongoose.Types.ObjectId(),
    description: 'task One',
    completed: false,
    owner: userOneId
}

const taskTwo = {
    _id: mongoose.Types.ObjectId(),
    description: 'task two',
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: mongoose.Types.ObjectId(),
    description: 'task Three',
    completed: false,
    owner: userTwoId
}

const setupDatabase = async() => {
    await users.deleteMany()
    await tasks.deleteMany()
    await new users(userOne).save()
    await new users(userTwo).save()
    await new tasks(taskOne).save()
    await new tasks(taskTwo).save()
    await new tasks(taskThree).save()
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}