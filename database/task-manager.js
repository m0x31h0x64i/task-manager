const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, (e) => {
    if (e) {
        console.log(`Error: ${e}`)
    } else {
        console.log(`Server connected to mongoDB successfuly!`)
    }
})