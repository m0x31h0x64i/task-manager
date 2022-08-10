const express = require('express')
const router = new express.Router()
const tasks = require('../models/tasks')
const auth = require('../middleware/authentication/auth')

router.post('/tasks', auth, async (req, res) => {
    try {

        const task = new tasks({
            ...req.body,
            owner: req.user._id
        })
        
        await task.save()
        res.status(201).send(task)

    } catch (e) {
        res.status(400).send(`Error: ${e}`)
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {

        const sort = {}
        if (req.query.sort) {
            const parts = req.query.sort.split(':')
            sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
        }

        const allTasks = await
            (req.query.completed == undefined
                ? tasks.find({ owner: req.user._id })
                : tasks.find({ owner: req.user._id, completed: req.query.completed }))
            .limit(req.query.limit)
            .skip(req.query.skip)
            .sort(sort)
            .exec();

        res.send(allTasks)

    } catch (e) {
        res.status(500).send(`Error: ${e}`)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try {

        const _id = req.params.id
        const singleTask = await tasks.findOne({ _id, owner: req.user._id })

        if (!singleTask) {
            return res.status(404).send()
        }

        res.send(singleTask)

    } catch (e) {
        res.status(500).send(`Error: ${e}`)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    try {

        const updates = Object.keys(req.body)
        const allowedUpdates = ['description', 'completed']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        
        if (!isValidOperation) {
            return res.status(404).send()
        }

        const taskToUpdate = await tasks.findOne({ _id: req.params.id, owner: req.user._id })
        
        if (!taskToUpdate) {
            return res.status(404).send()
        }

        updates.forEach((update) => taskToUpdate[update] = req.body[update])
        const updatedTask = await taskToUpdate.save()

        res.send(updatedTask)

    } catch(e) {
        res.status(500).send(`Error: ${e}`)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {

        const deleteSingleTask = await tasks.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!deleteSingleTask) {
            return res.status(404).send()
        }

        res.send(deleteSingleTask)

    } catch(e) {
        res.status(500).send(`Error: ${e}`)
    }
})

module.exports = router