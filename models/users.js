const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const tasks = require('./tasks')

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true,
        validate (value) {
            if (!validator.isEmail(value)) {
                throw new Error('This Email is not accepted!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate (value) {
            if (value.length < 6 || value.toLowerCase().includes('password')) {
                throw new Error('Password is easy. must be strong!')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
    } , {
    timestamps: true
})

// usersSchema.virtual('tasks', {
//     ref: 'tasks',
//     localField: '_id',
//     foreignField: 'owner'
// })

usersSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

usersSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

usersSchema.statics.findByCredentials = async (email, password) => {
    const userCredentials = await users.findOne({ email })
    
    if (!userCredentials) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, userCredentials.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return userCredentials
}

usersSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
    }

    next()
})

usersSchema.pre('remove', async function (next) {
    const user = this

    await tasks.deleteMany({ owner: user._id })

    next()
})

const users = mongoose.model('users', usersSchema) 

module.exports = users