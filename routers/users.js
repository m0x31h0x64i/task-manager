const express = require('express')
const router = new express.Router()
const users = require('../models/users')
const auth = require('../middleware/authentication/auth')
const upload = require('../middleware/upload/up')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelationEmail } = require('../email/mailer')

router.post('/users', async (req, res) => {
    try {

        const user = new users(req.body)

        if (!user) {
            res.status(400).send()
        }

        const token = await user.generateAuthToken()
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({ user, token })

    } catch (e) {
        res.status(500).send(`Error: ${e}`)
    }
})

router.post('/users/login', async (req, res) => {
    try {

        const user = await users.findByCredentials(req.body.email, req.body.password)
        
        if (!user) {
            return res.status(400).send()
        }
        
        const token = await user.generateAuthToken()
        res.send({ user, token })

    } catch (e) {
        res.status(500).send(`Error: ${e}`)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((item) => item.token != req.token)
        await req.user.save()
        res.send()

    } catch (e) {
        res.status(500).send(`Error: ${e}`)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {

        req.user.tokens = []
        await req.user.save()
        res.send()

    } catch (e) {
        res.status(500) .send(`Error: ${e}`)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    try {

        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'email', 'password']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
        if (!isValidOperation) {
            return res.status(400).send('This update not allowed!')
        }
        
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
        
    } catch (e) {
        res.status(500).send(`Error: ${e}`)
    }

})

router.delete('/users/me', auth, async (req, res) => {
    try {

        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)

    } catch (e) {
        res.status(500).send(`Error: ${e}`)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer

    await req.user.save()
    res.send('avatar uploaded!')

}, (err, req, res, next) => {
    res.status(400).send({ error: err.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    
    req.user.avatar = undefined
    await req.user.save()
    res.send('avatar removed!')
})

router.get('/users/:id/avatar', async (req, res) => {
    try {

        const user = await users.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send(`Error: ${e}`)
    }

})

module.exports = router