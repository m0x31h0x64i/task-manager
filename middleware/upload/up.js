const multer = require('multer')

const limits = { fileSize: 1000000 }

const fileFilter = function (req, file, cb) {

    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
        return cb(new Error('Please upload an image!'))
    }

    cb(undefined, true)
}

const upload = multer({
    limits,
    fileFilter
})

module.exports = upload