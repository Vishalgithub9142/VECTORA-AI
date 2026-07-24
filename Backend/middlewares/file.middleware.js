const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024  //3MB
    },
    fileFilter: (req, file, cb) => {
        console.log('📁 [FILE MIDDLEWARE] File received:', {
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        })
        cb(null, true)
    }
})

module.exports = upload