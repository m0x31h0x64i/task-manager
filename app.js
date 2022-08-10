const express = require('express')
require('./database/task-manager')
const tasksRouter = require('./routers/tasks')
const usersRouter = require('./routers/users')

const app = express()

// app.use((req, res, next) => {
//     res.status(503).send('Site is on maintenance.')
// })

app.use(express.json())
app.use(tasksRouter)
app.use(usersRouter)

module.exports = app