const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024,
        fieldSize: 20 * 1024,
        fields: 2,
        parts: 3
    },
    fileFilter: (req, file, cb) => {
        const isPdf = file.mimetype === 'application/pdf' && /\.pdf$/i.test(file.originalname)
        const error = isPdf ? null : Object.assign(new Error('Only PDF files are accepted'), { status: 400 })
        cb(error, isPdf)
    }
})

module.exports = upload